import { defineConfig } from "vite-plus";

const ignorePatterns = [
    "**/.next/**",
    "**/node_modules/**",
    "**/public/**",
    "**/styled-system/**",
    "**/app/src/components/ui/**",
    "**/env.d.ts",
    "**/worker-configuration.d.ts",
    "**/routeTree.gen.ts",
    "app/src/routes/(site)/_main/photos/-content/photos.json",
    "scripts/photo-sync-state.json",
    "**/storybook-static/**",
    "**/.source/**",
    "**/.cloudflare/**",
    "**/dist/**",
    "**/.tanstack/**",
    "**/reports/**",
    ".github/ISSUE_TEMPLATE/**",
];

export default defineConfig({
    fmt: {
        useTabs: false,
        tabWidth: 4,
        printWidth: 120,
        singleQuote: false,
        ignorePatterns,
    },
    lint: {
        ignorePatterns,
    },
});
