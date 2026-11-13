import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const storybookDir = resolve(import.meta.dirname, "..");
const staticDir = resolve(storybookDir, "storybook-static");
const outputDir = resolve(storybookDir, ".cloudflare/output/v0");
const workerDir = resolve(outputDir, "workers/default");
const assetsDir = resolve(workerDir, "assets");

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(assetsDir, { recursive: true });
cpSync(staticDir, assetsDir, { recursive: true });

writeFileSync(
    resolve(outputDir, "config.json"),
    JSON.stringify({ buildContext: { isPreview: false, mode: "production" } }),
);

writeFileSync(
    resolve(workerDir, "worker.config.json"),
    JSON.stringify({
        name: "nikomaru-portfolio-storybook",
        compatibilityDate: "2025-01-01",
        domains: ["storybook.next.nikomaru.dev"],
        previewUrls: true,
    }),
);
