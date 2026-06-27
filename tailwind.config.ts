import type { Config } from "tailwindcss";

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

                // ─── Surfaces ────────────────────────────────────────────────
                // Usage: bg-surface-page, bg-surface-card, etc.
                surface: {
                    page: { DEFAULT: "#f5f0eb", dark: "#141414" },
                    card: { DEFAULT: "#ffffff", dark: "#242424" },
                    raised: { DEFAULT: "#f0e8e0", dark: "#2d2d2d" },
                    hover: { DEFAULT: "#e8ddd4", dark: "#333333" },
                },

                // ─── Orange accent ramp ───────────────────────────────────────
                // Usage: bg-accent, bg-accent-50, border-accent-border, etc.
                accent: {
                    50: "#fff3e8",   // light: icon bg tint      | dark: –
                    200: "#ffd4b0",   // light: badge bg           | dark: badge text
                    400: "#f5843a",   // light: –                  | dark: icon color / hover
                    600: "#c05a00",   // light: icon color / arrow | dark: –
                    800: "#7a2e00",   // light: badge text         | dark: badge bg
                    950: "#3d1600",   // light: –                  | dark: icon bg
                    DEFAULT: "#e2630a",   // main orange — buttons, CTAs
                    border: {
                        DEFAULT: "rgba(192, 90, 0, 0.35)",  // light border rest
                        hover: "rgba(192, 90, 0, 0.65)",  // light border hover
                        dark: "rgba(226, 99, 10, 0.40)", // dark border rest
                        "dark-hover": "rgba(226, 99, 10, 0.70)", // dark border hover
                    },
                },

                // ─── Content (text) ───────────────────────────────────────────
                // Usage: text-content-primary, text-content-muted, etc.
                content: {
                    primary: { DEFAULT: "#1a1410", dark: "#fff8f0" },
                    secondary: { DEFAULT: "#4a3020", dark: "#d4c9bc" },
                    muted: { DEFAULT: "#7a6050", dark: "#7a6e65" },
                    inverse: "#0d0d0d", // text on solid orange buttons (both modes)
                },

                colors: {

                    // ─── Surfaces ─────────────────────────────────────────────────
                    // Light:  bg-surface-page      bg-surface-card      bg-surface-raised
                    // Dark:   bg-surface-page-dark bg-surface-card-dark bg-surface-raised-dark
                    surface: {
                        page: "#f5f0eb",
                        "page-dark": "#141414",
                        card: "#ffffff",
                        "card-dark": "#242424",
                        raised: "#f0e8e0",
                        "raised-dark": "#2d2d2d",
                        hover: "#e8ddd4",
                        "hover-dark": "#333333",
                    },

                    // ─── Orange accent ramp ────────────────────────────────────────
                    // bg-accent  bg-accent-50  bg-accent-200 ... bg-accent-950
                    accent: {
                        50: "#fff3e8",
                        200: "#ffd4b0",
                        400: "#f5843a",
                        600: "#c05a00",
                        800: "#7a2e00",
                        950: "#3d1600",
                        DEFAULT: "#e2630a",
                    },

                    // ─── Content (text) ────────────────────────────────────────────
                    // Light:  text-content-primary      text-content-muted
                    // Dark:   text-content-primary-dark text-content-muted-dark
                    content: {
                        primary: "#1a1410",
                        "primary-dark": "#fff8f0",
                        secondary: "#4a3020",
                        "secondary-dark": "#d4c9bc",
                        muted: "#7a6050",
                        "muted-dark": "#7a6e65",
                        inverse: "#0d0d0d",
                    },

                    // ─── Borders ──────────────────────────────────────────────────
                    // Used as: border-edge-subtle  border-edge-accent etc.
                    // For rgba borders use the CSS variables defined in globals.css below
                    edge: {
                        subtle: "#e8ddd4",
                        "subtle-dark": "#222222",
                        default: "#d4c0ae",
                        "default-dark": "#2a2520",
                        strong: "#b09080",
                        "strong-dark": "#3d3028",
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
                    "card-accent": "0 0 0 1.5px rgba(192, 90, 0, 0.35)",
                    "card-accent-hover": "0 0 0 1.5px rgba(192, 90, 0, 0.65)",
                    "card-dark": "0 0 0 1.5px rgba(226, 99, 10, 0.40)",
                    "card-dark-hover": "0 0 0 1.5px rgba(226, 99, 10, 0.70)",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;


