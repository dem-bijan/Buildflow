/**
 * Minimal in-memory rate limiter, keyed by IP + route.
 *
 * Good enough for a single server / low traffic. It resets on deploy and
 * doesn't work across multiple server instances.
 *
 * For production on Vercel/serverless or multi-instance deployments, swap this
 * for something backed by shared storage, e.g. Upstash Redis
 * (`@upstash/ratelimit`) or your backend doing the rate limiting itself.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

interface RateLimitOptions {
    limit: number; // max attempts
    windowMs: number; // per this many milliseconds
}

export function checkRateLimit(
    key: string,
    { limit, windowMs }: RateLimitOptions
): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true };
    }

    if (bucket.count >= limit) {
        return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
    }

    bucket.count += 1;
    return { allowed: true };
}

// Periodically clear expired buckets so this Map doesn't grow forever.
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
        if (now > bucket.resetAt) buckets.delete(key);
    }
}, 60_000).unref?.();