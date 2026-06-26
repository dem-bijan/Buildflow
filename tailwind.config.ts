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
                brand: {
                    50: "#FFF7ED",
                    100: "#FFEDD5",
                    200: "#FED7AA",
                    400: "#F97316",
                    500: "#EA580C",
                    600: "#C2410C",
                    700: "#9A3412",
                    900: "#7C2D12",
                },
                surface: {
                    50: "#1C1C1C",
                    100: "#161616",
                    200: "#111111",
                    300: "#0D0D0D",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;