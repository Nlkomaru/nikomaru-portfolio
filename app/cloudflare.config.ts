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
            CF_ACCESS_CLIENT_ID: bindings.secretsStoreSecret({
                storeId: "d36d5a11ea07462c83bb21a0e9ccb811",
                secretName: "shared_CLOUDFLARE_ACCESS_CLIENT_ID",
            }),
            CF_ACCESS_CLIENT_SECRET: bindings.secretsStoreSecret({
                storeId: "d36d5a11ea07462c83bb21a0e9ccb811",
                secretName: "shared_CLOUDFLARE_ACCESS_CLIENT_SECRET",
            }),
        },
    },
});
