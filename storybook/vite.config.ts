import { resolve } from "node:path";
import pandacss from "@pandacss/dev/postcss";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";

const appDir = resolve(import.meta.dirname, "../app");

export default defineConfig({
    css: {
        postcss: {
            plugins: [pandacss, autoprefixer],
        },
    },
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
