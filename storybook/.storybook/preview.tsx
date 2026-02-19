import "./preview.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import * as React from "react";
import { themes } from "storybook/theming";
import { registerAPCACheck } from "./a11y";
import { withDummyRouter } from "./dummy-router";

const apca = registerAPCACheck("silver");

// テーマを適用するデコレータ
const withTheme: Decorator = (Story, context) => {
    const colorMode = context.globals.colorMode || "light";
    React.useEffect(() => {
        const root = document.documentElement;

        if (colorMode === "dark") {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
        }
    }, [colorMode]);

    return <Story />;
};

const preview: Preview = {
    globalTypes: {
        colorMode: {
            description: "Color mode",
            defaultValue: "light",
            toolbar: {
                title: "Color Mode",
                icon: "circlehollow",
                items: [
                    { value: "light", icon: "sun", title: "Light" },
                    { value: "dark", icon: "moon", title: "Dark" },
                ],
            },
        },
    },
    parameters: {
        docs: {
            theme: themes.dark,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        backgrounds: {
            default: "light",
            values: [
                { name: "light", value: "#fffcfc" },
                { name: "dark", value: "#1a0607" },
            ],
        },
        a11y: {
            test: "todo",
            context: "body",
            config: {
                checks: [...apca.checks],
                rules: [
                    {
                        id: "autocomplete-valid",
                        selector: '*:not([autocomplete="nope"])',
                    },
                    {
                        id: "image-alt",
                        enabled: false,
                    },
                    {
                        id: "color-contrast",
                        enabled: false,
                    },
                    {
                        id: "color-contrast-enhanced",
                        enabled: false,
                    },
                    ...apca.rules,
                ],
            },
            options: {},
        },
    },
    decorators: [withTheme, withDummyRouter("/")],
};

export default preview;
