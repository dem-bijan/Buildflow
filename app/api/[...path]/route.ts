import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    const backendPath = "/" + params.path.join("/");
    return proxyToBackend(req, backendPath);
}

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    const backendPath = "/" + params.path.join("/");
    return proxyToBackend(req, backendPath);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    const backendPath = "/" + params.path.join("/");
    return proxyToBackend(req, backendPath);
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    const backendPath = "/" + params.path.join("/");
    return proxyToBackend(req, backendPath);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    const backendPath = "/" + params.path.join("/");
    return proxyToBackend(req, backendPath);
}
