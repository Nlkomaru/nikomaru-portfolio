import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { sva } from "styled-system/css";
import { deLocalizeHref, getLocale, setLocale } from "../paraglide/runtime";
import { ThemeToggleButton } from "./theme-toggle-button";

const desktopNavbarStyles = sva({
    slots: ["nav", "brand", "navList", "bottomControls", "localeLink"],
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
            borderRightColor: "border.subtle",
            bg: "bg.canvas",
            py: "6",
        },
        brand: {
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "fg.default",
            fontFamily: '"Space Mono", monospace',
        },
        navList: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6",
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
            px: "2",
            py: "2",
            borderRadius: "full",
            borderWidth: "1px",
            borderColor: "transparent",
            transition: "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "fg.default",
            _hover: {
                bg: "bg.subtle",
                borderColor: "border.outline",
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

const desktopNavbarItemStyles = sva({
    slots: ["link", "dot", "label"],
    base: {
        link: {
            position: "relative",
            display: "block",
            _hover: {
                '& [data-slot="nav-label"]': {
                    opacity: 1,
                },
            },
        },
        dot: {
            h: "2",
            w: "2",
            borderRadius: "full",
            transition: "all 0.5s ease",
        },
        label: {
            position: "absolute",
            top: "50%",
            left: "6",
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "fg.muted",
            opacity: 0,
            transition: "opacity 0.3s ease",
        },
    },
    variants: {
        state: {
            active: {
                dot: {
                    bg: "fg.default",
                    opacity: 1,
                },
            },
            inactive: {
                dot: {
                    bg: "fg.subtle",
                    opacity: 0.45,
                },
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

    const navItems = [
        { label: "Index", to: "/" },
        { label: "Talks", to: "/talks" },
        { label: "Projects", to: "/projects" },
        { label: "About", to: "/about" },
        { label: "Pictures", to: "/pictures" },
    ] as const;

    const styles = desktopNavbarStyles();

    return (
        <nav className={styles.nav}>
            <Link to="/" className={styles.brand} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                NIKOMARU
                <br />
                PORTFOLIO
            </Link>

            <div className={styles.navList}>
                {navItems.map((item, index) => {
                    const isActive = currentPath === item.to;
                    const itemStyles = desktopNavbarItemStyles({
                        state: isActive ? "active" : "inactive",
                    });

                    return (
                        <Link key={item.to} to={item.to} className={itemStyles.link}>
                            <div
                                className={itemStyles.dot}
                                style={{ transform: isActive ? "scale(1.3)" : "scale(1)" }}
                            />
                            <span className={itemStyles.label} data-slot="nav-label">
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
