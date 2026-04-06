import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const appDir = resolve(import.meta.dirname, "../app");

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: "@/",
                replacement: `${resolve(appDir, "src")}/`,
            },
            {
                find: "styled-system/",
                replacement: `${resolve(appDir, "styled-system")}/`,
            },
        ],
    },
});
