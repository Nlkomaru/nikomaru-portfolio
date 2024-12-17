import {defineConfig, defineTextStyles} from "@pandacss/dev";
import {createPreset} from "@park-ui/panda-preset";
import amber from "@park-ui/panda-preset/colors/amber";
import sand from "@park-ui/panda-preset/colors/sand";

export const textStyles = defineTextStyles({
    body: {
        description: "The body text style - used in paragraphs",
        value: {
            fontFamily: "var(--font-poppins), var(--font-zen-kaku-gothic-new)",
            fontSize: "18px",
            lineHeight: "1.75",
            fontWeight: "500",
        },
    },
})

export default defineConfig({
    // Whether to use css reset
    preflight: true,
    presets: [
        createPreset({accentColor: amber, grayColor: sand, radius: "sm"}),
    ],
    // Where to look for your css declarations
    include: [
        "./src/components/**/*.{ts,tsx,js,jsx}",
        "./src/app/**/*.{ts,tsx,js,jsx}",
    ],
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
