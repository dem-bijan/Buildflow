import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/session";

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
    } catch {
        return NextResponse.json({ error: "Unable to reach the server" }, { status: 502 });
    }

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
        return NextResponse.json({ error: "Not authenticated" }, { status: backendRes.status });
    }

    // Your backend wraps responses in ApiResponse<AuthResponse> — adjust the
    // path below if your envelope shape differs.
    const user = data?.data ?? data;

    return NextResponse.json({ user }, { status: 200 });
}