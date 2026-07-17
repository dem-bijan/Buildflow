import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie, setSessionCookie } from "@/lib/session";
import { changeEmailSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function PATCH(req: NextRequest) {
    const token = await getSessionCookie();
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, retryAfterSeconds } = checkRateLimit(`change-email:${ip}`, {
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

    const parsed = changeEmailSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me/email`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(parsed.data),
            cache: "no-store",
        });
    } catch (err) {
        logServerError("auth.change_email.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
        if (backendRes.status >= 500) {
            logServerError("auth.change_email.backend_error", { status: backendRes.status });
        }
        const message =
            backendRes.status === 401
                ? "Current password is incorrect"
                : backendRes.status === 409
                    ? "An account with this email already exists."
                    : "Unable to update email";
        return NextResponse.json({ error: message }, { status: backendRes.status });
    }

    // Email changes the JWT subject — the old token is no longer valid, so we
    // must replace the session cookie with the freshly issued one.
    const token2 = data?.data?.accessToken ?? data?.accessToken;
    if (!token2) {
        logServerError("auth.change_email.missing_token_in_response", { status: backendRes.status });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }
    await setSessionCookie(token2);

    return NextResponse.json({ user: { email: data?.data?.email, role: data?.data?.role } }, { status: 200 });
}
