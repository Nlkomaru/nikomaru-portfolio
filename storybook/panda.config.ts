import { defineConfig } from "@pandacss/dev";
import { animationStyles } from "../app/theme/animation-styles";
import { breakpoints } from "../app/theme/breakpoints";
import { globalCss } from "../app/theme/global-css";
import { keyframes } from "../app/theme/keyframes";
import { layerStyles } from "../app/theme/layer-styles";
import { recipes } from "../app/theme/recipes";
import { semanticTokens } from "../app/theme/semantic-tokens";
import { slotRecipes } from "../app/theme/slot-recipes";
import { textStyles } from "../app/theme/text-styles";
import { tokens } from "../app/theme/tokens";

const { container: _containerRecipe, ...pandaRecipes } = recipes;


export default defineConfig({
    globalCss,
    preflight: true,
    presets: ["@pandacss/preset-base"],
    include: [
        "./stories/**/*.{ts,tsx}",
        "./.storybook/**/*.{ts,tsx}",
        "../app/src/**/*.{ts,tsx}",
        "../app/theme/**/*.{ts,tsx}",
    ],
    exclude: [],
    jsxFramework: "react",
    outdir: "styled-system",
    theme: {
        extend: {
            animationStyles,
            breakpoints,
            keyframes,
            layerStyles,
            recipes: pandaRecipes,
            semanticTokens,
            slotRecipes,
            textStyles,
            tokens,
        },
    },
});
