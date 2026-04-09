import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { sva } from "styled-system/css";
import { deLocalizeHref, getLocale, setLocale } from "../paraglide/runtime";

const headerLayoutStyles = sva({
    slots: ["desktopNav", "brand", "navList", "localeLink", "mobileBar"],
    base: {
        desktopNav: {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 50,
            display: { base: "none", md: "flex" },
            h: "100vh",
            w: "14",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            borderRightWidth: "1px",
            borderColor: "border.subtle",
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
        localeLink: {
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "fg.subtle",
        },
        mobileBar: {
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 40,
            display: { base: "block", md: "none" },
            h: "14",
            w: "full",
            borderBottomWidth: "1px",
            borderColor: "border.subtle",
            bg: "bg.canvas",
        },
    },
});

const headerNavItemStyles = sva({
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

export default function Header() {
    const routerState = useRouterState();
    const locale = getLocale();
    const targetLocale = locale === "ja" ? "en" : "ja";
    const basePathname = deLocalizeHref(routerState.location.pathname);
    const localeSearch = { ...routerState.location.search, __locale: targetLocale };
    const currentPath = deLocalizeHref(routerState.location.pathname);
    const navItems = [
        { label: "Index", to: "/" },
        { label: "Works", to: "/works" },
        { label: "Talks", to: "/talks" },
        { label: "About", to: "/about" },
        { label: "Pictures", to: "/pictures" },
        { label: "Contact", to: "/contact" },
    ];
    const layoutStyles = headerLayoutStyles();

    return (
        <>
            <nav className={layoutStyles.desktopNav}>
                <Link
                    to="/"
                    className={layoutStyles.brand}
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    NIKOMARU
                    <br />
                    PORTFOLIO
                </Link>

                <div className={layoutStyles.navList}>
                    {navItems.map((item, index) => {
                        const isActive = currentPath === item.to;
                        const itemStyles = headerNavItemStyles({
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

                <Link
                    to={basePathname}
                    search={localeSearch}
                    hash={routerState.location.hash}
                    onClick={() => setLocale(targetLocale, { reload: false })}
                    className={layoutStyles.localeLink}
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
            </nav>
            <div className={layoutStyles.mobileBar} />
        </>
    );
}
