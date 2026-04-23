import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { sva } from "styled-system/css";
import CustomCursor from "../components/custom-cursor";
import NoiseOverlay from "../components/noise-overlay";
import { Button } from "../components/ui";
import { m } from "../paraglide/messages";

const appPageStyles = sva({
    slots: ["root", "icon", "iconText", "iconImage"],
    base: {
        root: {
            minH: "100vh",
            bg: "bg.canvas",
            px: { base: "8", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: "6",
            maxW: "4xl",
            mx: "auto",
            color: "fg.default",
            justifyContent: "center",
        },
        icon: {
            display: "flex",
            flexDirection: "row",
            gap: "4",
            alignItems: "center",
        },
        iconText: {
            fontSize: "2xl",
            fontWeight: "bold",
            color: "fg.default",
        },
        iconImage: {
            borderRadius: "full",
        },
    },
});
export const Route = createFileRoute("/")({ component: AppPage });

function AppPage() {
    const styles = appPageStyles();

    return (
        <div className={styles.root}>
            <div className={styles.icon}>
                <img className={styles.iconImage} src="https://avatars.githubusercontent.com/u/76208219?v=4" alt="icon" width={64} height={64} />
                <p className={styles.iconText}>Hi, I'm Nikomaru</p>
            </div>
            <p>{m["top.introP1"]()}</p>
            <p>{m["top.introP2"]()}</p>
            <p>{m["top.introP3"]()}</p>
        </div>
    );
}