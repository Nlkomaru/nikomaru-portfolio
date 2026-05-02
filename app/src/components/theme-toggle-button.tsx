"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { sva } from "styled-system/css";

const themeToggleButtonStyles = sva({
    slots: ["button", "icon"],
    base: {
        button: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            h: "10",
            w: "10",
            borderRadius: "full",
            bg: "bg.canvas",
            color: "fg.default",
            transition: "background-color 0.2s ease, transform 0.2s ease",
            _hover: {
                bg: "bg.subtle",
            },
            _active: {
                transform: "scale(0.98)",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "2px",
            },
        },
        icon: {
            h: "4",
            w: "4",
        },
    },
});

type ThemeMode = "light" | "dark";

export function ThemeToggleButton() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const styles = themeToggleButtonStyles();

    useEffect(() => {
        setMounted(true);
    }, []);

    const mode: ThemeMode | null = useMemo(() => {
        if (!mounted) return null;
        return resolvedTheme === "light" ? "light" : resolvedTheme === "dark" ? "dark" : null;
    }, [mounted, resolvedTheme]);

    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";

    return (
        <button
            type="button"
            className={styles.button}
            aria-label={mode ? `Switch to ${nextMode} theme` : "Switch theme"}
            onClick={() => setTheme(nextMode)}
        >
            {mode === "light" ? <Moon className={styles.icon} /> : <Sun className={styles.icon} />}
        </button>
    );
}
