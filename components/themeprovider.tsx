"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { flushSync } from "react-dom";

export type TransitionVariant =
    | "circle"
    | "square"
    | "triangle"
    | "diamond"
    | "hexagon"
    | "rectangle"
    | "star";

interface ThemeToggleProps {
    duration?: number;
    variant?: TransitionVariant;
    /** When true, the transition expands from the viewport center instead of the button center. */
    fromCenter?: boolean;
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
    const pairs = Array.from(
        { length: vertexCount },
        () => `${cx}px ${cy}px`
    ).join(", ");
    return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
    variant: TransitionVariant,
    cx: number,
    cy: number,
    maxRadius: number,
    viewportWidth: number,
    viewportHeight: number
): [string, string] {
    switch (variant) {
        case "circle":
            return [
                `circle(0px at ${cx}px ${cy}px)`,
                `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ];
        case "square": {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const halfSide = Math.max(halfW, halfH) * 1.05;
            const end = [
                `${cx - halfSide}px ${cy - halfSide}px`,
                `${cx + halfSide}px ${cy - halfSide}px`,
                `${cx + halfSide}px ${cy + halfSide}px`,
                `${cx - halfSide}px ${cy + halfSide}px`,
            ].join(", ");
            return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
        }
        case "triangle": {
            const scale = maxRadius * 2.2;
            const dx = (Math.sqrt(3) / 2) * scale;
            const verts = [
                `${cx}px ${cy - scale}px`,
                `${cx + dx}px ${cy + 0.5 * scale}px`,
                `${cx - dx}px ${cy + 0.5 * scale}px`,
            ].join(", ");
            return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
        }
        case "diamond": {
            const R = maxRadius * Math.SQRT2;
            const end = [
                `${cx}px ${cy - R}px`,
                `${cx + R}px ${cy}px`,
                `${cx}px ${cy + R}px`,
                `${cx - R}px ${cy}px`,
            ].join(", ");
            return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
        }
        case "hexagon": {
            const R = maxRadius * Math.SQRT2;
            const verts: string[] = [];
            for (let i = 0; i < 6; i++) {
                const a = -Math.PI / 2 + (i * Math.PI) / 3;
                verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
            }
            return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`];
        }
        case "rectangle": {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const end = [
                `${cx - halfW}px ${cy - halfH}px`,
                `${cx + halfW}px ${cy - halfH}px`,
                `${cx + halfW}px ${cy + halfH}px`,
                `${cx - halfW}px ${cy + halfH}px`,
            ].join(", ");
            return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
        }
        case "star": {
            const R = maxRadius * Math.SQRT2 * 1.03;
            const innerRatio = 0.42;
            const starPolygon = (radius: number) => {
                const verts: string[] = [];
                for (let i = 0; i < 5; i++) {
                    const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                    verts.push(
                        `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`
                    );
                    const innerA = outerA + Math.PI / 5;
                    verts.push(
                        `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`
                    );
                }
                return `polygon(${verts.join(", ")})`;
            };
            const startR = Math.max(2, R * 0.025);
            return [starPolygon(startR), starPolygon(R)];
        }
        default:
            return [
                `circle(0px at ${cx}px ${cy}px)`,
                `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ];
    }
}

export default function ThemeToggle({
    duration = 400,
    variant = "circle",
    fromCenter = false,
}: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => setMounted(true), []);

    const isDark = theme === "dark";

    const toggleTheme = useCallback(() => {
        const button = buttonRef.current;
        if (!button) return;

        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

        let x: number;
        let y: number;
        if (fromCenter) {
            x = viewportWidth / 2;
            y = viewportHeight / 2;
        } else {
            const { top, left, width, height } = button.getBoundingClientRect();
            x = left + width / 2;
            y = top + height / 2;
        }

        const maxRadius = Math.hypot(
            Math.max(x, viewportWidth - x),
            Math.max(y, viewportHeight - y)
        );

        const applyTheme = () => {
            setTheme(isDark ? "light" : "dark");
        };

        if (typeof document.startViewTransition !== "function") {
            applyTheme();
            return;
        }

        const clipPath = getThemeTransitionClipPaths(
            variant,
            x,
            y,
            maxRadius,
            viewportWidth,
            viewportHeight
        );

        const root = document.documentElement;
        root.dataset.magicuiThemeVt = "active";
        root.style.setProperty(
            "--magicui-theme-toggle-vt-duration",
            `${duration}ms`
        );
        root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

        const cleanup = () => {
            delete root.dataset.magicuiThemeVt;
            root.style.removeProperty("--magicui-theme-toggle-vt-duration");
            root.style.removeProperty("--magicui-theme-vt-clip-from");
        };

        const transition = document.startViewTransition(() => {
            flushSync(applyTheme);
        });

        if (typeof transition?.finished?.finally === "function") {
            transition.finished.finally(cleanup);
        } else {
            cleanup();
        }

        const ready = transition?.ready;
        if (ready && typeof ready.then === "function") {
            ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath,
                    },
                    {
                        duration,
                        easing: variant === "star" ? "linear" : "ease-in-out",
                        fill: "forwards",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            });
        }
    }, [variant, fromCenter, duration, isDark, setTheme]);

    // Guard clause moved underneath all hooks
    if (!mounted) return null;

    return (
        <div className="flex items-center gap-2.5">
            <span className={`text-[13px] transition-colors ${isDark ? "text-white font-medium" : "text-orange-400"}`}>
                Light
            </span>

            <button
                ref={buttonRef}
                onClick={toggleTheme}
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

            <span className={`text-[13px] transition-colors ${isDark ? "text-orange-400 font-medium" : "text-black-400"}`}>
                Dark
            </span>
        </div>
    );
}