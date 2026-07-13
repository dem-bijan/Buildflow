"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { search } from "@/lib/search/search";

export default function SearchBar() {
    const { user } = useAuth();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const results = search(query, user?.role);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    function go(href: string) {
        router.push(href);
        setQuery("");
        setOpen(false);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!open || results.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            go(results[activeIndex].href);
        } else if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
        }
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)} // allow click on result
                    onKeyDown={handleKeyDown}
                    placeholder="Rechercher ici..."
                    className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-edge-subtle dark:border-edge-subtle-dark bg-surface-page dark:bg-surface-page-dark text-content-primary dark:text-content-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {open && results.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-surface-page dark:bg-surface-page-dark border border-edge-subtle dark:border-edge-subtle-dark rounded-lg shadow-lg overflow-hidden">
                    {results.map((r, i) => (
                        <button
                            key={r.href}
                            onMouseDown={() => go(r.href)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${i === activeIndex
                                    ? "bg-accent/10 text-accent"
                                    : "text-content-primary dark:text-content-primary-dark"
                                }`}
                        >
                            {r.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}