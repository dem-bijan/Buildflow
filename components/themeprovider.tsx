"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <div className="flex items-center gap-2.5">
            <span className={`text-[13px] transition-colors ${!isDark ? "text-zinc-900 font-medium" : "text-zinc-400"}`}>
                Light
            </span>

            <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
                className={`
                    relative w-[52px] h-[28px] rounded-full border transition-all duration-250 cursor-pointer
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    ${isDark
                        ? "bg-orange-950 border-orange-500"
                        : "bg-gray-100 border-gray-200"}
                `}
            >
                <span className={`
                    absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full
                    flex items-center justify-center transition-all duration-250
                    ${isDark
                        ? "translate-x-6 bg-orange-500 border-orange-500"
                        : "translate-x-0 bg-white border-gray-200"}
                    border
                `}>
                    {isDark
                        ? <Moon size={12} className="text-violet-900" />
                        : <Sun size={12} className="text-gray-400" />}
                </span>
            </button>

            <span className={`text-[13px] transition-colors ${isDark ? "text-zinc-900 font-medium" : "text-zinc-400"}`}>
                Dark
            </span>
        </div>
    );
}