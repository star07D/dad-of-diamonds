import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Product images are lightweight SVG placeholders (and, later, CMS URLs
      // rendered with a plain <img>). Deliberate — the optimizer isn't wanted here.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
