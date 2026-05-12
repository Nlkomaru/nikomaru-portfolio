import caveatLatin400Woff2 from "@fontsource/caveat/files/caveat-latin-400-normal.woff2?url";
import { createFileRoute } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { m } from "../paraglide/messages";
import { getLocale } from "../paraglide/runtime";
import { IntroP2 } from "./-components/intro-p2";
import { IntroP3 } from "./-components/intro-p3";

const appPageStyles = sva({
    slots: ["root", "greeting", "greetingText", "icon", "intro"],
    base: {
        root: {
            minH: {
                base: "calc(100dvh - 3.5rem)",
                md: "100dvh",
            },
            bg: "bg.canvas",
            px: { base: "4", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: "6",
            maxW: "4xl",
            mx: "auto",
            color: "fg.default",
            justifyContent: "center",
        },
        greeting: {
            display: "flex",
            flexDirection: "row",
            gap: { base: "4", md: "6" },
            alignItems: "center",
        },
        greetingText: {
            fontSize: "2xl",
            fontWeight: "bold",
            color: "fg.default",
            wordBreak: "keep-all",
        },
        icon: {
            borderRadius: "full",
        },
        intro: {
            color: "fg.subtle",
            display: "flex",
            fontSize: {
                base: "md",
                md: "lg",
            },
            flexDirection: "column",
            gap: "4",
            "& p": {
                overflowWrap: "break-word",
                lineBreak: "strict",
            },
            '& p[lang="ja"]': {
                wordBreak: "auto-phrase",
            },
        },
    },
});
export const Route = createFileRoute("/")({
    component: AppPage,
    headers: () => ({
        // Cache HTML at the edge to reduce TTFB on repeat visits.
        // Keep browser cache minimal to avoid stale locale-specific content.
        "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    }),
    head: () => ({
        links: [
            {
                rel: "preload",
                as: "font",
                type: "font/woff2",
                href: caveatLatin400Woff2,
                crossOrigin: "anonymous",
            },
        ],
    }),
});

function AppPage() {
    const styles = appPageStyles();
    const locale = getLocale();

    return (
        <div className={styles.root}>
            <div className={styles.greeting}>
                <img
                    className={styles.icon}
                    src="/icon.avif"
                    alt="icon"
                    width={48}
                    height={48}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <p className={styles.greetingText}>{m.homeGreeting()}</p>
            </div>
            <div className={styles.intro}>
                <p lang={locale}>{m["top.introP1"]()}</p>
                <IntroP2 />
                <IntroP3 />
            </div>
        </div>
    );
}
