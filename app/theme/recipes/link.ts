import { defineRecipe } from "@chakra-ui/react";

export const linkRecipe = defineRecipe({
    className: "chakra-link",
    base: {
        display: "inline-flex",
        alignItems: "center",
        outline: "none",
        gap: "1.5",
        cursor: "pointer",
        borderRadius: "l1",
        focusRing: "outside",
    },
    variants: {
        variant: {
            underline: {
                color: "black",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationColor: "currentColor/20",
            },
            plain: {
                color: "black",
                _hover: {
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                    textDecorationColor: "currentColor/20",
                },
            },
        },
    },
    defaultVariants: {
        variant: "plain",
    },
});
