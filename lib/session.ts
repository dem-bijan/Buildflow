import { cookies } from "next/headers";

/**
 * Every cookie security decision lives HERE and nowhere else.
 * If you need to change cookie behavior, this is the only file to touch.
 */

const SESSION_COOKIE = "session_token";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true, // JS on the page can never read this — kills XSS token theft
    secure: isProd, // HTTPS only in prod; relaxed locally so http://localhost still works
    sameSite: "lax" as const, // sent on top-level navigation, blocked on cross-site POSTs (CSRF mitigation)
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days — align with your backend's token expiry
};

export async function setSessionCookie(token: string) {
    const store = await cookies();
    store.set(SESSION_COOKIE, token, cookieOptions);
}

export async function getSessionCookie(): Promise<string | undefined> {
    const store = await cookies();
    return store.get(SESSION_COOKIE)?.value;
}

export async function clearSessionCookie() {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE };