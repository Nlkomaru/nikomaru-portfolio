import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-themes", "@storybook/addon-designs"],
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
        config.plugins = config.plugins || [];
        config.plugins.push(tailwindcss());

        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || [];

        // Viteのエイリアス設定（配列形式）
        if (Array.isArray(config.resolve.alias)) {
            config.resolve.alias.push({
                find: "@/",
                replacement: `${process.cwd()}/../app/src/`,
            });
        } else {
            config.resolve.alias["@/"] = `${process.cwd()}/../app/src/`;
        }

        return config;
    },
};
export default config;
