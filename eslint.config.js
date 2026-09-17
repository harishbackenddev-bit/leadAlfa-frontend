import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Build output, docs/ reference snippets, and legacy/dead source files
  // that no route imports — they have broken imports we don't want lint
  // to keep yelling about.
  globalIgnores([
    "dist",
    "creatorend/**",
    "docs/**",
    "src/Auth0/**",
    "src/components/examples/**",
    "src/components/portfolio/Blogs/BlogCard2.jsx",
    "src/pages/portfolio/SignUp.jsx",
    "src/pages/portfolio/SignIn.jsx",
  ]),

  // App code (JS / JSX).
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: { import: importPlugin },
    settings: {
      // The TypeScript resolver understands .ts/.tsx and the modern `exports`
      // field in package.json (needed for @tailwindcss/vite and similar).
      // It works fine for pure JS projects too — no tsconfig required.
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
        node: {
          extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".json",
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".webp",
            ".mp4",
            ".mov",
          ],
        },
      },
    },
    rules: {
      // Pre-existing code-style noise — surface as warnings so `npm run lint`
      // stays green and only blocks on issues that actually break Netlify.
      // You can still see them in the output, just not as build-breaking errors.
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "no-undef": "warn",
      "react-refresh/only-export-components": "warn",

      // THIS is the rule that catches the Netlify-breaking case-mismatch
      // bug (e.g. importing `./foo.png` when the file is `Foo.PNG`).
      // Keep it as an error so it fails the build before push.
      "import/no-unresolved": [
        "error",
        { caseSensitive: true, caseSensitiveStrict: true },
      ],
    },
  },

  // Vite / ESLint config files run in Node, so they need Node globals
  // (otherwise `process is not defined`, `__dirname is not defined`, etc.).
  {
    files: ["vite.config.{js,ts}", "eslint.config.{js,ts}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);
