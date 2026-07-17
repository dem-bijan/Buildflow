// Server-only structured error logging.
//
// Never import this from a "use client" component — it writes to the
// server process's stderr (visible via `docker logs` / your hosting
// platform's log stream), which is exactly where it should stay. It is
// never sent to the browser, so it's safe to include things like status
// codes and internal route context here. It must never be passed request
// bodies, tokens, or other user-supplied/secret values — only short,
// fixed context tags and primitive metadata (status codes, counts, etc.).

type LogMeta = Record<string, string | number | boolean | null | undefined>;

export function logServerError(context: string, meta?: LogMeta): void {
    console.error(
        JSON.stringify({
            level: "error",
            time: new Date().toISOString(),
            context,
            ...meta,
        })
    );
}
