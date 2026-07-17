import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/session";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET() {
    const token = await getSessionCookie();
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/users/pending`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch (err) {
        logServerError("users.pending.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);
    if (!backendRes.ok) {
        if (backendRes.status >= 500) {
            logServerError("users.pending.backend_error", { status: backendRes.status });
        }
        return NextResponse.json({ error: "Unable to load pending users" }, { status: backendRes.status });
    }
    return NextResponse.json(data, { status: backendRes.status });
}
