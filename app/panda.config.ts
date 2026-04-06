import { defineConfig } from "@pandacss/dev";
import { animationStyles } from "./theme/animation-styles";
import { breakpoints } from "./theme/breakpoints";
import { globalCss } from "./theme/global-css";
import { keyframes } from "./theme/keyframes";
import { layerStyles } from "./theme/layer-styles";
import { recipes } from "./theme/recipes";
import { semanticTokens } from "./theme/semantic-tokens";
import { slotRecipes } from "./theme/slot-recipes";
import { textStyles } from "./theme/text-styles";
import { tokens } from "./theme/tokens";

const { container: _containerRecipe, ...pandaRecipes } = recipes;

export default defineConfig({
    globalCss,
    preflight: true,
    include: ["./src/**/*.{js,jsx,ts,tsx}"],
    exclude: ["./src/routeTree.gen.ts"],
    jsxFramework: "react",
    outdir: "./styled-system",
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
