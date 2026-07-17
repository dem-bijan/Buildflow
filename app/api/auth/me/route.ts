import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie, clearSessionCookie } from "@/lib/session";
import { deleteAccountSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET() {
    const token = await getSessionCookie();

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch (err) {
        logServerError("auth.me.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
        if (backendRes.status >= 500) {
            logServerError("auth.me.backend_error", { status: backendRes.status });
        }
        return NextResponse.json({ error: "Not authenticated" }, { status: backendRes.status });
    }

    // Your backend wraps responses in ApiResponse<AuthResponse> — adjust the
    // path below if your envelope shape differs.
    const user = data?.data ?? data;

    return NextResponse.json({ user }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
    const token = await getSessionCookie();
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryAfterSeconds } = checkRateLimit(`delete-account:${ip}`, {
        limit: 5,
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

    const parsed = deleteAccountSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(parsed.data),
            cache: "no-store",
        });
    } catch (err) {
        logServerError("auth.delete_account.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    if (!backendRes.ok) {
        if (backendRes.status >= 500) {
            logServerError("auth.delete_account.backend_error", { status: backendRes.status });
        }
        const message =
            backendRes.status === 401
                ? "Current password is incorrect"
                : "Unable to delete account";
        return NextResponse.json({ error: message }, { status: backendRes.status });
    }

    await clearSessionCookie();
    return NextResponse.json({ ok: true }, { status: 200 });
}