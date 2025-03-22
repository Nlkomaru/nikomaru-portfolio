"use client";
import { css } from "@/styled-system/css";
import { motion } from "motion/react";
import Link from "next/link";
import { Icon } from "~/components/ui/styled/icon";
import { NAVIGATION_ITEMS } from "~/lib/constants/urls";

export const RootNavbar = () => {
    return (
        <motion.div
            className={css({
                display: {
                    base: "none",
                    lg: "block",
                },
            })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
        >
            <div
                className={css({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "8px",
                })}
            >
                {NAVIGATION_ITEMS.map((item) => (
                    <Link key={item.url} href={item.url} className={linkStyle}>
                        <Icon
                            className={css({
                                width: "24px",
                                height: "24px",
                            })}
                        >
                            <item.icon />
                        </Icon>
                        <div className={linkContentStyle}>{item.rootName}</div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

const linkStyle = css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "16px",
    gap: "16px",
});
const linkContentStyle = css({
    width: "35px",
    textAlign: "center",
    fontFamily: "var(--font-m-plus-1p)",
    writingMode: "vertical-rl",
    letterSpacing: "0.2em",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
});
