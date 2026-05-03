import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { sva } from "styled-system/css";
import { deLocalizeHref, getLocale, setLocale } from "../paraglide/runtime";
import { MobileNavigationMenu } from "./mobile-navigation-menu";
import { ThemeToggleButton } from "./theme-toggle-button";

const mobileHeaderStyles = sva({
    slots: ["bar", "inner", "brand", "controls", "localeButton"],
    base: {
        bar: {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 40,
            h: "16",
            w: "full",

            bg: "bg.canvas/60",
            backdropFilter: "blur(6px)",
        },
        inner: {
            h: "full",
            w: "full",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: "4",
            gap: "4",
        },
        brand: {
            ml: "2",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "fg.default",
            fontFamily: '"Space Mono", monospace',
            flex: 1,
        },
        controls: {
            display: "flex",
            alignItems: "center",
            gap: "3",
        },
        localeButton: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            h: "10",
            w: "10",
            borderRadius: "full",
            bg: "bg.canvas",
            color: "fg.default",
            transition: "background-color 0.2s ease, transform 0.2s ease",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
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
    },
});

export function MobileHeader() {
    const routerState = useRouterState();
    const locale = getLocale();
    const targetLocale = locale === "ja" ? "en" : "ja";
    const basePathname = deLocalizeHref(routerState.location.pathname);
    const localeSearch = { ...routerState.location.search, __locale: targetLocale };
    const styles = mobileHeaderStyles();

    return (
        <div className={styles.bar}>
            <div className={styles.inner}>
                <Link to="/" className={styles.brand}>
                    NIKOMARU
                    <br />
                    PORTFOLIO
                </Link>

                <div className={styles.controls}>
                    <ThemeToggleButton />
                    <Link
                        to={basePathname}
                        search={localeSearch}
                        hash={routerState.location.hash}
                        onClick={() => setLocale(targetLocale, { reload: false })}
                        className={styles.localeButton}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={targetLocale}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                            >
                                {targetLocale.toUpperCase()}
                            </motion.span>
                        </AnimatePresence>
                    </Link>
                    <MobileNavigationMenu />
                </div>
            </div>
        </div>
    );
}
