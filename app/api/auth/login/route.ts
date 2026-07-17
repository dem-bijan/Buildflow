import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/auth";
import { setSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Tighter limit on login than register — this is the endpoint brute-force
    // and credential-stuffing attacks target.
    const { allowed, retryAfterSeconds } = checkRateLimit(`login:${ip}`, {
        limit: 8,
        windowMs: 10 * 60 * 1000,
    });
    if (!allowed) {
        return NextResponse.json(
            { error: "Too many attempts. Please try again later." },
            { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
        );
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
            cache: "no-store"
        });
    } catch (err) {
        logServerError("auth.login.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
        // Pending-approval accounts get a distinct 403; everything else stays vague
        if (backendRes.status === 403) {
            return NextResponse.json(
                { error: data?.message ?? "Compte en attente d'approbation", pending: true },
                { status: 403 }
            );
        }
        if (backendRes.status >= 500) {
            logServerError("auth.login.backend_error", { status: backendRes.status });
        }
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const forwardedCookie = backendRes.headers.get("set-cookie");
    const token =
        data?.data?.accessToken ??
        data?.accessToken ??
        data?.token ??
        data?.access_token ??
        data?.jwt;

    if (token) {
        await setSessionCookie(token);
    } else if (forwardedCookie) {
        const res = NextResponse.json({ user: data?.user ?? null }, { status: 200 });
        res.headers.set("set-cookie", forwardedCookie);
        return res;
    } else {
        logServerError("auth.login.missing_token_in_response", { status: backendRes.status });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ user: data?.user ?? null }, { status: 200 });
}