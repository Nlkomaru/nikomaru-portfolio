"use client";

import { ChakraProvider } from "@chakra-ui/react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { system } from "../../../theme";

type ProviderProps = PropsWithChildren<ThemeProviderProps>;

export function Provider({ children, ...props }: ProviderProps) {
    return (
        <ChakraProvider value={system}>
            <ThemeProvider
                attribute="class"
                forcedTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
                {...props}
            >
                {children}
            </ThemeProvider>
        </ChakraProvider>
    );
}
