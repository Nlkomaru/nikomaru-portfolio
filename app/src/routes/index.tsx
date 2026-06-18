import caveatLatin400Woff2 from "@fontsource/caveat/files/caveat-latin-400-normal.woff2?url";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { sva } from "styled-system/css";
import { m } from "../paraglide/messages";
import { getLocale } from "../paraglide/runtime";
import { IntroP2 } from "./-components/intro-p2";
import { IntroP3 } from "./-components/intro-p3";

const appPageStyles = sva({
    slots: ["root", "greeting", "greetingText", "greetingCharacter", "icon", "intro"],
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
            wordBreak: "keep-all",
            color: "fg.subtle",
            lineHeight: "1.5",
            whiteSpace: "nowrap",
        },
        greetingCharacter: {
            display: "inline-block",
        },
        icon: {
            borderRadius: "full",
        },
        intro: {
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
        },
    },
});

const pageContainerMotion = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 2.2,
        },
    },
};

const introContainerMotion = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0.12,
            staggerChildren: 0.2,
        },
    },
};

const introItemMotion = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.72, ease: "easeOut" },
    },
};

const greetingTextMotion = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.78,
        },
    },
};

const greetingSegmentMotion = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.075,
        },
    },
};

const greetingCharacterMotion = {
    hidden: { opacity: 0, y: 8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

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
    const greeting = m["home.greeting"]();

    return (
        <motion.div
            className={styles.root}
            variants={pageContainerMotion}
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
        >
            <motion.div className={styles.greeting} variants={introItemMotion}>
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
                <motion.p className={styles.greetingText} variants={greetingTextMotion} aria-label={greeting}>
                    {renderAnimatedGreetingSegment(m["home.greetingLead"](), "lead", styles.greetingCharacter)}
                    {renderAnimatedGreetingSegment(m["home.greetingName"](), "name", styles.greetingCharacter)}
                </motion.p>
            </motion.div>
            <motion.div className={styles.intro} variants={introContainerMotion}>
                <motion.p lang={locale} variants={introItemMotion}>
                    {m["home.introP1"]()}
                </motion.p>
                <motion.div variants={introItemMotion}>
                    <IntroP2 />
                </motion.div>
                <motion.div variants={introItemMotion}>
                    <IntroP3 />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function renderAnimatedGreetingSegment(text: string, segmentKey: string, characterClassName: string) {
    const characterCounts = new Map<string, number>();

    return (
        <motion.span variants={greetingSegmentMotion} aria-hidden="true">
            {Array.from(text).map((character) => {
                const count = characterCounts.get(character) ?? 0;
                characterCounts.set(character, count + 1);

                return (
                    <motion.span
                        key={`${segmentKey}-${character}-${count}`}
                        className={characterClassName}
                        variants={greetingCharacterMotion}
                    >
                        {character === " " ? "\u00A0" : character}
                    </motion.span>
                );
            })}
        </motion.span>
    );
}
