import { Dialog, Portal } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { sva } from "styled-system/css";
import { navigationItems } from "./navigation-items";

const mobileNavigationMenuStyles = sva({
    slots: [
        "trigger",
        "menuIcon",
        "backdrop",
        "positioner",
        "content",
        "menuHeader",
        "menuHeaderInner",
        "menuBrand",
        "closeButton",
        "menuBody",
        "menuBodyInner",
        "menuList",
        "menuItem",
        "menuLink",
        "menuIndex",
        "menuLabel",
    ],
    base: {
        trigger: {
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
        menuIcon: {
            h: "5",
            w: "5",
        },
        backdrop: {
            bg: "blackAlpha.700",
            backdropFilter: "blur(12px)",
        },
        positioner: {
            alignItems: "stretch",
        },
        content: {
            minH: "100dvh",
            bg: "bg.canvas",
            color: "fg.default",
            display: "flex",
            flexDirection: "column",
        },
        menuHeader: {
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "border.subtle",
        },
        menuHeaderInner: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            h: "16",
            gap: "4",
            w: "full",
            maxW: "7xl",
            mx: "auto",
            px: { base: "4", md: "12" },
        },
        menuBrand: {
            ml: "2",
            fontSize: "0.75rem",
            lineHeight: "1.5",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "fg.default",
            fontFamily: '"Space Mono", monospace',
            flex: 1,
            minW: 0,
            textDecoration: "none",
        },
        closeButton: {
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
        menuBody: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
        },
        menuBodyInner: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
            w: "full",
            maxW: "7xl",
            mx: "auto",
            px: { base: "6", md: "12" },
            py: { base: "12", md: "16" },
        },
        menuList: {
            w: "full",
            maxW: "xl",
            display: "flex",
            flexDirection: "column",
            gap: "0",
            m: 0,
            p: 0,
        },
        menuItem: {
            listStyle: "none",
            w: "full",
        },
        menuLink: {
            display: "flex",
            justifyContent: "space-between",
            gap: "4",
            w: "full",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "border.subtle",
            py: "4",
            color: "fg.default",
            textDecoration: "none",
            transition: "transform 0.2s ease, border-color 0.2s ease, color 0.2s ease",
            _hover: {
                color: "fg.default",
                borderBottomColor: "border.outline",
                transform: "translateX(4px)",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "4px",
            },
        },
        menuIndex: {
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "fg.muted",
            fontFamily: '"Space Mono", monospace',
        },
        menuLabel: {
            fontSize: "clamp(1.75rem, 8vw, 2.5rem)",
            lineHeight: "1",
            letterSpacing: "-0.04em",
            fontWeight: "600",
        },
    },
});

export function MobileNavigationMenu() {
    const [open, setOpen] = useState(false);
    const styles = mobileNavigationMenuStyles();

    return (
        <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)} size="full" motionPreset="scale">
            <Dialog.Trigger asChild>
                <button type="button" className={styles.trigger} aria-label="Open navigation menu">
                    <Menu className={styles.menuIcon} />
                </button>
            </Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop className={styles.backdrop} />
                <Dialog.Positioner className={styles.positioner}>
                    <Dialog.Content className={styles.content}>
                        <div className={styles.menuHeader}>
                            <div className={styles.menuHeaderInner}>
                                <Link to="/" className={styles.menuBrand} onClick={() => setOpen(false)}>
                                    NIKOMARU
                                    <br />
                                    PORTFOLIO
                                </Link>

                                <button
                                    type="button"
                                    className={styles.closeButton}
                                    aria-label="Close navigation menu"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className={styles.menuIcon} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.menuBody}>
                            <div className={styles.menuBodyInner}>
                                <ul className={styles.menuList}>
                                    {navigationItems.map((item, index) => (
                                        <li key={item.to} className={styles.menuItem}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.35,
                                                    delay: 0.08 + index * 0.12,
                                                    ease: "easeOut",
                                                }}
                                            >
                                                <Link
                                                    to={item.to}
                                                    className={styles.menuLink}
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span className={styles.menuLabel}>{item.label}</span>
                                                    <span className={styles.menuIndex}>
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
