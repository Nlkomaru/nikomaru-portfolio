import { defineSemanticTokens } from "@chakra-ui/react";

export const shadows = defineSemanticTokens.shadows({
    xs: {
        value: {
            _light: "0px 1px 2px rgba(24, 24, 27, 0.1), 0px 0px 1px rgba(24, 24, 27, 0.2)",
            _dark: "0px 1px 1px rgba(9, 9, 11, 0.64), 0px 0px 1px inset rgba(212, 212, 216, 0.2)",
        },
    },
    sm: {
        value: {
            _light: "0px 2px 4px rgba(24, 24, 27, 0.1), 0px 0px 1px rgba(24, 24, 27, 0.3)",
            _dark: "0px 2px 4px rgba(9, 9, 11, 0.64), 0px 0px 1px inset rgba(212, 212, 216, 0.3)",
        },
    },
    md: {
        value: {
            _light: "0px 4px 8px rgba(24, 24, 27, 0.1), 0px 0px 1px rgba(24, 24, 27, 0.3)",
            _dark: "0px 4px 8px rgba(9, 9, 11, 0.64), 0px 0px 1px inset rgba(212, 212, 216, 0.3)",
        },
    },
    lg: {
        value: {
            _light: "0px 8px 16px rgba(24, 24, 27, 0.1), 0px 0px 1px rgba(24, 24, 27, 0.3)",
            _dark: "0px 8px 16px rgba(9, 9, 11, 0.64), 0px 0px 1px inset rgba(212, 212, 216, 0.3)",
        },
    },
    xl: {
        value: {
            _light: "0px 16px 24px rgba(24, 24, 27, 0.1), 0px 0px 1px rgba(24, 24, 27, 0.3)",
            _dark: "0px 16px 24px rgba(9, 9, 11, 0.64), 0px 0px 1px inset rgba(212, 212, 216, 0.3)",
        },
    },
    "2xl": {
        value: {
            _light: "0px 24px 40px rgba(24, 24, 27, 0.16), 0px 0px 1px rgba(24, 24, 27, 0.3)",
            _dark: "0px 24px 40px rgba(9, 9, 11, 0.64), 0px 0px 1px inset rgba(212, 212, 216, 0.3)",
        },
    },
    inner: {
        value: {
            _light: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            _dark: "inset 0 2px 4px 0 #09090B",
        },
    },
    inset: {
        value: {
            _light: "inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
            _dark: "inset 0 0 0 1px rgba(212, 212, 216, 0.05)",
        },
    },
});
