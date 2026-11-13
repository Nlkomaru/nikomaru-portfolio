import { bindings, defineConfig } from "cf/config";

export default defineConfig({
    worker: {
        name: "nikomaru-portfolio",
        compatibilityDate: "2025-09-02",
        compatibilityFlags: ["nodejs_compat"],
        entrypoint: "./worker.ts",
        previewUrls: true,
        observability: {
            enabled: true,
        },
        domains: ["nikomaru.dev", "www.nikomaru.dev"],
        env: {
            CF_ACCESS_CLIENT_ID: bindings.secret(),
            CF_ACCESS_CLIENT_SECRET: bindings.secret(),
            R2_PUBLIC_URL: bindings.secret(),
        },
    },
});
