import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
    await clearSessionCookie();
    // If your backend tracks server-side sessions/refresh tokens, also call
    // its logout/revoke endpoint here (forwarding the session cookie) so the
    // token is invalidated server-side, not just deleted from the browser.
    return NextResponse.json({ ok: true });
}