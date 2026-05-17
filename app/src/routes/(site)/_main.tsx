import { createFileRoute, Outlet } from "@tanstack/react-router";
import { sva } from "styled-system/css";

import { SiteFooter } from "@/components/site-footer";

const siteShellStyles = sva({
    slots: ["root", "main"],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            display: "flex",
            flexDirection: "column",
            bg: "bg.canvas",
            color: "fg",
        },
        main: {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            minH: "0",
        },
    },
});

export const Route = createFileRoute("/(site)/_main")({
    component: SiteShellLayout,
});

function SiteShellLayout() {
    const styles = siteShellStyles();

    return (
        <div className={styles.root}>
            <div className={styles.main}>
                <Outlet />
            </div>
            <SiteFooter />
        </div>
    );
}
