import type { Config } from "tailwindcss";

// NOTE: Tailwind v4 reads color tokens from the `@theme` block in
// app/globals.css — that's the actual source of truth. This file has no
// `@config` directive pulling it in, so it is not currently loaded. Kept
// in sync anyway for documentation and in case `@config` is added later.
export default {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['var(--font-roboto-mono)', 'monospace'],
                script: ['var(--font-marck-script)', 'cursive'],
            },
            colors: {
                // ─── Surfaces ─────────────────────────────────────────────────
                // Light:  bg-surface-page      bg-surface-card      bg-surface-raised
                // Dark:   bg-surface-page-dark bg-surface-card-dark bg-surface-raised-dark
                surface: {
                    page: "#f4f5f7",
                    "page-dark": "#111318",
                    card: "#ffffff",
                    "card-dark": "#1a1d25",
                    raised: "#eceef1",
                    "raised-dark": "#242830",
                    hover: "#e4e7ec",
                    "hover-dark": "#242830",
                },

                // ─── Red accent ramp — matches the legacy BuildFlow ERP prototype ──
                // bg-accent  bg-accent-50  bg-accent-200 ... bg-accent-950
                accent: {
                    50: "#fbeaea",
                    200: "#f0aeaf",
                    400: "#e8333a",
                    600: "#8f1619",
                    800: "#5c0f12",
                    950: "#2e0708",
                    DEFAULT: "#ba1c21",
                },

                // ─── Content (text) ────────────────────────────────────────────
                // Light:  text-content-primary      text-content-muted
                // Dark:   text-content-primary-dark text-content-muted-dark
                content: {
                    primary: "#111318",
                    "primary-dark": "#fafbfd",
                    secondary: "#3d4350",
                    "secondary-dark": "#b4bbce",
                    muted: "#5a6275",
                    "muted-dark": "#5a6275",
                    inverse: "#ffffff", // text on solid accent buttons (both modes)
                },

                // ─── Borders ──────────────────────────────────────────────────
                // Used as: border-edge-subtle  border-edge-default etc.
                edge: {
                    subtle: "#e5e7eb",
                    "subtle-dark": "#242830",
                    default: "#d6d9de",
                    "default-dark": "#2e333d",
                    strong: "#aeb4bf",
                    "strong-dark": "#3d4350",
                },
            },

            // ─── Border radius ─────────────────────────────────────────────
            borderRadius: {
                card: "12px",
                badge: "20px",
                icon: "8px",
            },

            // ─── Box shadow (used as accent rgba border trick) ─────────────
            // shadow-card-accent       → light mode accent border
            // shadow-card-accent-hover → light mode accent border hover
            // shadow-card-dark         → dark mode accent border
            // shadow-card-dark-hover   → dark mode accent border hover
            boxShadow: {
                "card-accent": "0 0 0 1.5px rgba(186, 28, 33, 0.35)",
                "card-accent-hover": "0 0 0 1.5px rgba(186, 28, 33, 0.65)",
                "card-dark": "0 0 0 1.5px rgba(232, 51, 58, 0.40)",
                "card-dark-hover": "0 0 0 1.5px rgba(232, 51, 58, 0.70)",
            },
        },
    },
    plugins: [],
} satisfies Config;
