import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/session";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const token = await getSessionCookie();
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(`${BACKEND_URL}/api/v1/users/${id}/reject`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch (err) {
        logServerError("users.reject.backend_unreachable", { message: err instanceof Error ? err.message : "unknown" });
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);
    if (!backendRes.ok) {
        if (backendRes.status >= 500) {
            logServerError("users.reject.backend_error", { status: backendRes.status });
        }
        return NextResponse.json({ error: "Unable to reject this user" }, { status: backendRes.status });
    }
    return NextResponse.json(data, { status: backendRes.status });
}
