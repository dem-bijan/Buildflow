import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/auth";
import { setSessionCookie } from "@/lib/session";
import { checkRateLimit } from "@/lib/rateLimit";

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
        console.log("BACKEND_URL =", BACKEND_URL);
        console.log("Calling:", `${BACKEND_URL}/api/v1/auth/login`);
        backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
            cache: "no-store"
        });
    } catch {
        return NextResponse.json({ error: "Unable to reach the server" }, { status: 502 });
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
        console.error("Login failed", backendRes.status, data);
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
        console.error("Login succeeded but no token/cookie found in backend response", data);
        return NextResponse.json({ error: "Unexpected server response" }, { status: 502 });
    }

    return NextResponse.json({ user: data?.user ?? null }, { status: 200 });
}