import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { sva } from "styled-system/css";
import { deLocalizeHref, getLocale, setLocale } from "../paraglide/runtime";
import { navigationItems } from "./navigation-items";
import { ThemeToggleButton } from "./theme-toggle-button";

const desktopNavbarStyles = sva({
    slots: ["nav", "brand", "navList", "navLink", "navIcon", "navLabel", "bottomControls", "localeLink"],
    base: {
        nav: {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 50,
            display: "flex",
            h: "100vh",
            w: "14",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            borderRightColor: "border",
            bg: "bg.canvas",
            py: "6",
        },
        brand: {
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "fg.subtle",
            fontFamily: '"Space Mono", monospace',
        },
        navList: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2",
        },
        navLink: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            h: "10",
            w: "10",
            borderRadius: "full",
            color: "fg.subtle",
            transition: "background-color 0.2s ease, color 0.2s ease",
            _hover: {
                bg: "bg.subtle",
                '& [data-slot="nav-label"]': {
                    opacity: 1,
                },
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "2px",
            },
            '&[data-active="true"]': {
                bg: "bg.subtle",
                color: "fg.subtle",
                '& [data-slot="nav-icon"]': {
                    opacity: 1,
                    transform: "scale(1.08)",
                },
            },
        },
        navIcon: {
            h: "5",
            w: "5",
            opacity: 0.45,
            strokeWidth: 2,
            transition: "transform 0.3s ease, opacity 0.2s ease",
        },
        navLabel: {
            position: "absolute",
            top: "50%",
            left: "12",
            bg: "bg.canvas",
            borderRadius: "full",
            p: "1",
            px: "2",
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            fontWeight: "medium",
            color: "fg.muted",
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 0.2s ease",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "border",  
        },
        bottomControls: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4",
        },
        localeLink: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            h: "10",
            w: "10",
            borderRadius: "full",
            transition: "background-color 0.2s ease, transform 0.2s ease",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "fg",
            _hover: {
                bg: "bg.subtle",
            },
            _active: {
                transform: "scale(0.98)",
                color: "fg.subtle",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "2px",
            },
        },
    },
});

export function DesktopNavbar() {
    const routerState = useRouterState();
    const locale = getLocale();
    const targetLocale = locale === "ja" ? "en" : "ja";
    const basePathname = deLocalizeHref(routerState.location.pathname);
    const localeSearch = { ...routerState.location.search, __locale: targetLocale };
    const currentPath = deLocalizeHref(routerState.location.pathname);

    const styles = desktopNavbarStyles();

    return (
        <nav className={styles.nav}>
            <Link to="/" className={styles.brand} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                NIKOMARU
                <br />
                PORTFOLIO
            </Link>

            <div className={styles.navList}>
                {navigationItems.map((item, index) => {
                    const isActive = item.to === "/" ? currentPath === item.to : currentPath.startsWith(item.to);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={styles.navLink}
                            aria-label={item.label}
                            data-active={isActive}
                        >
                            <Icon className={styles.navIcon} data-slot="nav-icon" aria-hidden="true" />
                            <span className={styles.navLabel} data-slot="nav-label">
                                {String(index + 1).padStart(2, "0")}—{item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className={styles.bottomControls}>
                <ThemeToggleButton />
                <Link
                    to={basePathname}
                    search={localeSearch}
                    hash={routerState.location.hash}
                    onClick={() => setLocale(targetLocale, { reload: false })}
                    className={styles.localeLink}
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
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
            </div>
        </nav>
    );
}
