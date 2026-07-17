import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { jwtDecode } from "jwt-decode";
import { isAllowed, type Role } from "@/lib/auth/permissions";

const PROTECTED_PREFIXES = ["/dashboard", "/account"];

interface TokenPayload {
    exp: number;
    role: Role;

}

function decodeToken(token: string): TokenPayload | null {
    try {
        const payload = jwtDecode<TokenPayload>(token);
        if (!payload.exp || Date.now() >= payload.exp * 1000) return null;
        return payload;
    } catch {
        return null;
    }
}



export function middleware(req: NextRequest) {

    const { pathname } = req.nextUrl;
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const payload = token ? decodeToken(token) : null;

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