import { motion } from "motion/react";
import { sva } from "styled-system/css";

const aboutIntroductionStyles = sva({
    slots: ["root", "title", "body", "avatar", "copy", "paragraph"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "7", md: "9" },
        },
        title: {
            color: "fg.subtle",
            fontFamily: "heading",
            fontSize: { base: "3xl", md: "5xl" },
            fontWeight: "semibold",
            letterSpacing: "0",
            lineHeight: "1.2",
        },
        body: {
            display: "flow-root",
        },
        avatar: {
            boxSize: { base: "5.5rem", md: "6.5rem" },
            borderRadius: "md",
            objectFit: "cover",
            float: "left",
            mt: "1",
            mr: { base: "4", md: "9" },
            mb: { base: "2", sm: "3" },
        },
        copy: {
            display: "contents",
        },
        paragraph: {
            color: "fg",
            fontSize: { base: "sm", md: "md" },
            lineHeight: { base: "1.85", md: "1.9" },
        },
    },
});

interface AboutIntroductionProps {
    avatarAlt: string;
    aboutTitle: string;
    paragraphs: string[];
}

export default function AboutIntroduction({ avatarAlt, aboutTitle, paragraphs }: AboutIntroductionProps) {
    const styles = aboutIntroductionStyles();

    return (
        <motion.section
            className={styles.root}
            aria-labelledby="about-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            <h1 id="about-heading" className={styles.title}>
                {aboutTitle}
            </h1>
            <div className={styles.body}>
                <img
                    className={styles.avatar}
                    src="/profile-icon.avif"
                    alt={avatarAlt}
                    width={512}
                    height={512}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <div className={styles.copy}>
                    {paragraphs.map((paragraph) => (
                        <p key={paragraph} className={styles.paragraph}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
