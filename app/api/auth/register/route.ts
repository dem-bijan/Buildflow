import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/auth";
import { setSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL; // e.g. https://api.buildflow.ma — server-side only, never NEXT_PUBLIC_

export async function POST(req: NextRequest) {
    // --- 1. Rate limit (per IP) ---------------------------------------------
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryAfterSeconds } = checkRateLimit(`register:${ip}`, {
        limit: 5,
        windowMs: 15 * 60 * 1000, // 5 attempts per 15 min
    });
    if (!allowed) {
        return NextResponse.json(
            { error: "Too many attempts. Please try again later." },
            { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
        );
    }

    // --- 2. Validate input server-side (never trust the client) ------------
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { email, password, role } = parsed.data;

    const payload = { email, password, role };

    // --- 3. Call the real backend from the server, never from the browser --
    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store",
        });
    } catch (err) {
        logServerError("auth.register.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
        if (backendRes.status >= 500) {
            logServerError("auth.register.backend_error", { status: backendRes.status });
        }
        const message =
            backendRes.status === 409
                ? "An account with this email already exists."
                : "Registration failed. Please check your details and try again.";
        return NextResponse.json({ error: message }, { status: backendRes.status });
    }

    // --- 4. Normalize whatever the backend returned into our own cookie ----
    const forwardedCookie = backendRes.headers.get("set-cookie");
    const token =
        data?.data?.accessToken ??
        data?.accessToken ??
        data?.token ??
        data?.access_token ??
        data?.jwt;

    if (token) {
        await setSessionCookie(token);
        return NextResponse.json({ user: data?.data ?? data?.user ?? null, pending: false }, { status: 201 });
    }

    if (forwardedCookie) {
        // Backend already issued its own cookie — re-set it explicitly so it
        // reaches the actual client, since we proxied this server-side.
        const res = NextResponse.json({ user: data?.user ?? null, pending: false }, { status: 201 });
        res.headers.set("set-cookie", forwardedCookie);
        return res;
    }

    // No token and no cookie is EXPECTED for a privileged role awaiting
    // approval — this is success, not failure. The account was created but
    // cannot log in until an approver acts.
    return NextResponse.json(
        { user: data?.data ?? data?.user ?? null, pending: true },
        { status: 201 }
    );
}