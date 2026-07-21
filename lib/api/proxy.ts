import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/session";
import { logServerError } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function proxyToBackend(req: NextRequest, backendPath: string) {
    const token = await getSessionCookie();

    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${token || ""}`);

    // Remove host header to avoid issues with the backend expecting its own host
    headers.delete("host");

    const url = new URL(req.url);
    const backendUrl = `${BACKEND_URL}/api/v1${backendPath}${url.search}`;

    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
        try {
            body = await req.clone().text();
        } catch {
            // No body
        }
    }

    try {
        const response = await fetch(backendUrl, {
            method: req.method,
            headers,
            body,
            // don't cache API proxy requests
            cache: "no-store",
        });

        // Try to parse JSON to return it properly formatted
        let responseBody: unknown = null;
        const text = await response.text();
        if (text) {
            try {
                responseBody = JSON.parse(text);
            } catch {
                responseBody = text;
            }
        }

        if (response.status >= 500) {
            logServerError("proxy.backend_error", { path: backendPath, method: req.method, status: response.status });
        }

        // Return the response preserving status code
        if (typeof responseBody === "string") {
            return new NextResponse(responseBody, {
                status: response.status,
                headers: {
                    "Content-Type": response.headers.get("Content-Type") || "text/plain"
                }
            });
        }

        return NextResponse.json(responseBody, { status: response.status });
    } catch (err) {
        logServerError("proxy.backend_unreachable", {
            path: backendPath,
            method: req.method,
            message: err instanceof Error ? err.message : "unknown",
        });
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 502 }
        );
    }
}
