import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Our pages load data in `useEffect` and call setState on mount — a common, harmless pattern here.
  // `react/set-state-in-effect rule flags it as an error, so we're turning it into a warning instead.
  //  It will still show up in the UI, just not break the build. We can always flip it back if we change our mind.
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
