import { SEARCH_INDEX, SearchItem } from "./SearchIndex";
import { isAllowed, type Role } from "@/lib/auth/permissions";

function normalize(s: string): string {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// Classic Levenshtein edit distance: minimum single-character edits
// (insert/delete/substitute) to turn `a` into `b`.
function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,      // deletion
                dp[i][j - 1] + 1,      // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }
    return dp[m][n];
}

// Fuzzy similarity as a 0-1 score: 1 = identical, 0 = completely different.
function similarity(a: string, b: string): number {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - levenshtein(a, b) / maxLen;
}

// Best fuzzy score of `query` against any word in `target` (handles
// multi-word titles like "Gestion des Stocks" matching "stock").
function bestWordSimilarity(query: string, target: string): number {
    const words = target.split(/\s+/);
    let best = similarity(query, target); // whole-string comparison too
    for (const w of words) {
        best = Math.max(best, similarity(query, w));
    }
    return best;
}

function scoreMatch(query: string, item: SearchItem): number {
    const q = normalize(query);
    const title = normalize(item.title);

    // Tier 1: exact / prefix / substring (cheap, exact intent)
    if (title === q) return 100;
    if (title.startsWith(q)) return 90;
    if (title.includes(q)) return 75;

    for (const kw of item.keywords) {
        const nkw = normalize(kw);
        if (nkw === q) return 70;
        if (nkw.startsWith(q)) return 65;
        if (nkw.includes(q)) return 55;
    }

    // Tier 2: fuzzy match against title and keywords — catches typos,
    // transpositions ("tahca" -> "achat"), and near-misses.
    let fuzzy = bestWordSimilarity(q, title);
    for (const kw of item.keywords) {
        fuzzy = Math.max(fuzzy, bestWordSimilarity(q, normalize(kw)));
    }

    // Require reasonable similarity so unrelated queries don't match.
    // Short queries need a stricter bar; longer ones can tolerate more noise.
    const threshold = q.length <= 4 ? 0.55 : 0.45;
    if (fuzzy >= threshold) {
        return Math.round(fuzzy * 50); // scaled below exact/substring tiers
    }

    return 0;
}

export function search(query: string, role: string | undefined): SearchItem[] {
    if (!query.trim()) return [];

    return SEARCH_INDEX
        .filter((item) => isAllowed(item.href, role as Role | undefined))
        .map((item) => ({ item, score: scoreMatch(query, item) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.item)
        .slice(0, 8);
}