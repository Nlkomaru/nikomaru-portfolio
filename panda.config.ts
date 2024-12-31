import {defineConfig, defineGlobalStyles, defineTextStyles} from "@pandacss/dev";
import {createPreset} from "@park-ui/panda-preset";
import sky from "@park-ui/panda-preset/colors/sky";
import neutral from "@park-ui/panda-preset/colors/neutral";

export const textStyles = defineTextStyles({
    body: {
        description: "The body text style - used in paragraphs",
        value: {
            fontFamily: "var(--font-poppins), var(--font-zen-maru-gothic)",
            fontSize: {
                base: "sm",
                md: "md",
                lg: "lg",
            },
            lineHeight: "1.75",
            fontWeight: "400",
        },
    },
});

const globalCss = defineGlobalStyles({
    '*::selection': {
        bg: 'var(--colors-color-palette-4)/60',
    },
});


export default defineConfig({
    // Whether to use css reset
    globalCss,
    preflight: true,
    presets: [
        createPreset({
            accentColor: sky,
            grayColor: neutral,
            radius: "sm",
        }),

    ],
    // Where to look for your css declarations
    include: [
        "./src/components/**/*.{ts,tsx,js,jsx}",
        "./src/app/**/*.{ts,tsx,js,jsx}",
    ],
    conditions: {
        extend: {
            light: "[data-theme=light] &",
            dark: "[data-theme=dark] &",
        },
    },
    // Files to exclude
    exclude: [],

    // Useful for theme customization
    theme: {
        extend: {textStyles},
    },
    jsxFramework: "react",
    // The output directory for your css system
    outdir: "styled-system",
});
