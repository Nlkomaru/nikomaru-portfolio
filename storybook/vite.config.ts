import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [tailwindcss(), react()],
    resolve: {
        alias: [
            {
                find: "@/",
                replacement: `${__dirname}/../app/src/`,
            },
        ],
    },
});
