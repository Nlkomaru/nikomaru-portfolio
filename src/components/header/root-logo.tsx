"use client";

import { css } from "@/styled-system/css";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const RootLogo = () => {
    const { setTheme, theme } = useTheme();
    const [clientTheme, setClientTheme] = useState<string | undefined>(
        undefined,
    );

    useEffect(() => {
        setClientTheme(theme);
    }, [theme]);

    return (
        <motion.h1
            className={css({
                flex: "1 0 0",
                fontFamily: "var(--font-montserrat-alternates)",
                fontSize: {
                    base: "32px",
                    md: "48px",
                    lg: "64px",
                },
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                _firstLetter: {
                    fontFamily: "var(--font-montserrat)",
                },
            })}
            initial={{ x: "-200%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            Nikomaru
            <br />
            Portfoli
            <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                    setTheme(clientTheme === "dark" ? "light" : "dark");
                }}
                className={css({
                    color: "var(--colors-fg-default)/40",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                })}
            >
                o
            </button>
        </motion.h1>
    );
};
