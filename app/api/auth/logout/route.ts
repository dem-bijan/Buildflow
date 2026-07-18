import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionCookie } from "@/lib/session";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST() {
    // Revoke the token server-side first so it can't be replayed for the rest of
    // its lifetime, then clear the cookie. If the backend is unreachable we still
    // clear the cookie — a failed revoke must never leave the user "stuck" logged in.
    const token = await getSessionCookie();
    if (token) {
        try {
            await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
        } catch (err) {
            logServerError("auth.logout.backend_unreachable", {
                message: err instanceof Error ? err.message : "unknown",
            });
        }
    }

    await clearSessionCookie();
    return NextResponse.json({ ok: true });
}
