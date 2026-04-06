import { fileURLToPath, URL } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import pandacss from "@pandacss/dev/postcss";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { urlPatternsWithFallback } from "./src/i18n/translated-pathnames";

const config = defineConfig({
    css: {
        postcss: {
            plugins: [pandacss, autoprefixer],
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    plugins: [
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/paraglide",
            strategy: ["url", "cookie", "baseLocale"],
            urlPatterns: urlPatternsWithFallback,
        }),
        devtools(),
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        tanstackStart(),
        viteReact(),
    ],
});

export default config;
