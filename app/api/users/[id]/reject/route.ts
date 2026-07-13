import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const token = await getSessionCookie();
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/users/${id}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
}