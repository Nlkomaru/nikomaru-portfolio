import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
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

// project-slugs.ts と同じ規則: `-content/<Slug>/ja.md` があるディレクトリだけを対象にする。
// vite.config は import.meta.glob を束縛しないため、ここでは fs で読み取る。
const projectsContentRoot = fileURLToPath(new URL("./src/routes/(site)/_main/projects/-content", import.meta.url));

function collectProjectSlugsForPrerender(): string[] {
    if (!existsSync(projectsContentRoot)) {
        return [];
    }
    return readdirSync(projectsContentRoot)
        .filter((entryName) => {
            const entryPath = join(projectsContentRoot, entryName);
            try {
                return statSync(entryPath).isDirectory() && existsSync(join(entryPath, "ja.md"));
            } catch {
                return false;
            }
        })
        .sort((a, b) => a.localeCompare(b));
}

const projectSlugs = collectProjectSlugsForPrerender();

const projectPrerenderPages = projectSlugs.flatMap((slug) => [
    {
        path: `/projects/${slug}`,
        prerender: { enabled: true },
    },
    {
        path: `/ja/projects/${slug}`,
        prerender: { enabled: true },
    },
]);

const config = defineConfig({
    // import.meta.glob で ?raw 以外の .md を拾う経路やツールチェーン向けのフォールバック。
    assetsInclude: ["**/*.md"],
    server: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        // Cloudflare Tunnel 経由で dev server に届く Host ヘッダーを許可する。
        allowedHosts: [".trycloudflare.com", ".nikomaru.dev"],
    },
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
        tanstackStart({
            prerender: {
                enabled: true,
                // 明示したページだけを静的生成し、意図しないリンク巡回は避ける。
                autoStaticPathsDiscovery: false,
                crawlLinks: false,
                failOnError: true,
            },
            pages: [
                {
                    path: "/",
                    prerender: { enabled: true },
                },
                ...projectPrerenderPages,
            ],
        }),
        viteReact(),
    ],
});

export default config;
