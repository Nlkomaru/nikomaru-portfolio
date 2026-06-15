import { Blocks, PanelsTopLeft, Waypoints } from "lucide-react";
import { motion } from "motion/react";
import { sva } from "styled-system/css";

const aboutIntroductionStyles = sva({
    slots: [
        "root",
        "content",
        "summary",
        "title",
        "highlights",
        "highlight",
        "icon",
        "highlightText",
        "copy",
        "paragraph",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "6", md: "10" },
        },
        content: {
            display: "grid",
            gridTemplateColumns: { base: "minmax(0, 1fr)", lg: "minmax(20rem, 0.8fr) minmax(0, 1.2fr)" },
            gap: { base: "8", lg: "16" },
            alignItems: "start",
        },
        summary: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "7", md: "9" },
        },
        title: {
            maxW: "2xl",
            color: "fg.subtle",
            fontFamily: "heading",
            fontSize: { base: "3xl", md: "4xl", xl: "5xl" },
            fontWeight: "semibold",
            letterSpacing: "-0.035em",
            lineHeight: { base: "1.25", md: "1.18" },
        },
        highlights: {
            display: "flex",
            flexDirection: "column",
            borderBlockWidth: "1px",
            borderColor: "border.default",
        },
        highlight: {
            display: "grid",
            gridTemplateColumns: "2rem minmax(0, 1fr)",
            gap: "3",
            alignItems: "center",
            py: "3.5",
            borderBottomWidth: "1px",
            borderColor: "border.default",
            _last: {
                borderBottomWidth: "0",
            },
        },
        icon: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "fg.muted",
            "& svg": {
                boxSize: "4",
                strokeWidth: "1.5",
            },
        },
        highlightText: {
            color: "fg",
            fontSize: { base: "sm", md: "md" },
            lineHeight: "1.6",
        },
        copy: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "4", md: "5" },
            pt: { lg: "1" },
        },
        paragraph: {
            color: "fg",
            fontSize: { base: "sm", md: "md" },
            lineHeight: { base: "1.85", md: "1.9" },
        },
    },
});

interface AboutIntroductionProps {
    title: string;
    paragraphs: string[];
    highlights: string[];
}

const highlightIcons = [Blocks, Waypoints, PanelsTopLeft];

export default function AboutIntroduction({ title, paragraphs, highlights }: AboutIntroductionProps) {
    const styles = aboutIntroductionStyles();

    return (
        <motion.header
            className={styles.root}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            <div className={styles.content}>
                <div className={styles.summary}>
                    <h1 className={styles.title}>{title}</h1>
                    <ul className={styles.highlights}>
                        {highlights.map((highlight, index) => {
                            const Icon = highlightIcons[index % highlightIcons.length];

                            return (
                                <li key={highlight} className={styles.highlight}>
                                    <span className={styles.icon} aria-hidden>
                                        <Icon />
                                    </span>
                                    <span className={styles.highlightText}>{highlight}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className={styles.copy}>
                    {paragraphs.map((paragraph) => (
                        <p key={paragraph} className={styles.paragraph}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </motion.header>
    );
}
