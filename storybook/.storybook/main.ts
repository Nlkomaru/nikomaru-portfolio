import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const appDir = resolve(process.cwd(), "../app");
const appSrcDir = resolve(appDir, "src");
const appStyledSystemDir = resolve(appDir, "styled-system");
const appPublicDir = resolve(appDir, "public");

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-themes", "@storybook/addon-designs"],
    staticDirs: [appPublicDir],
    core: {
        builder: "@storybook/builder-vite",
    },
    refs: {
        "@chakra-ui/react": {
            disable: true,
        },
    },
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    viteFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || [];

        const aliases = [
            {
                find: "@/",
                replacement: `${appSrcDir}/`,
            },
            {
                find: "styled-system/",
                replacement: `${appStyledSystemDir}/`,
            },
        ];

        if (Array.isArray(config.resolve.alias)) {
            config.resolve.alias.push(...aliases);
        } else {
            config.resolve.alias = aliases;
        }

        return config;
    },
};
export default config;
