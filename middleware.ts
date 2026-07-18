import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { jwtVerify, decodeJwt } from "jose";
import { isAllowed, type Role } from "@/lib/auth/permissions";

const PROTECTED_PREFIXES = ["/dashboard", "/account"];

// The same HS256 secret the backend signs with. Server-side only — never expose it
// as NEXT_PUBLIC_. When set, the middleware verifies the token's *signature*, so a
// hand-crafted cookie can't even reach the dashboard shell. When unset, it falls back
// to an expiry-only decode; the backend still independently verifies every data call,
// so this is a UX gate either way — verification just makes it a real one.
const JWT_SECRET = process.env.JWT_SECRET;
const secretKey = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

interface TokenPayload {
    exp?: number;
    role?: Role;
}

async function readToken(token: string): Promise<TokenPayload | null> {
    try {
        if (secretKey) {
            // Verifies signature AND expiry; throws on either failure.
            const { payload } = await jwtVerify(token, secretKey);
            return payload as TokenPayload;
        }
        // No shared secret configured: decode without verifying, but still honour expiry.
        const payload = decodeJwt(token) as TokenPayload;
        if (!payload.exp || Date.now() >= payload.exp * 1000) return null;
        return payload;
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const payload = token ? await readToken(token) : null;

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

    if (isProtected && !payload) {
        const homeUrl = new URL("/", req.url);
        homeUrl.searchParams.set("signin", "1");
        homeUrl.searchParams.set("next", pathname);
        const res = NextResponse.redirect(homeUrl);
        res.cookies.delete(SESSION_COOKIE);
        return res;
    }

    if (isProtected && payload && !isAllowed(pathname, payload.role)) {
        return NextResponse.redirect(new URL("/dashboard?forbidden=1", req.url));
    }

    const res = NextResponse.next();
    if (isProtected) {
        res.headers.set("Cache-Control", "no-store, must-revalidate");
    }
    return res;
}

export const config = {
    matcher: ["/dashboard/:path*", "/account/:path*"],
};
