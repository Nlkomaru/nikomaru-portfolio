import { motion } from "motion/react";
import { sva } from "styled-system/css";
import type { AboutStory } from "../-types/about";

const aboutPersonalSectionsStyles = sva({
    slots: [
        "root",
        "sectionTitle",
        "topic",
        "topicWithImage",
        "topicCopy",
        "topicCopyReverse",
        "topicTitle",
        "copy",
        "paragraph",
        "media",
        "mediaReverse",
        "image",
        "caption",
        "future",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
        },
        sectionTitle: {
            color: "fg.subtle",
            fontFamily: "heading",
            fontSize: { base: "2xl", md: "3xl" },
            fontWeight: "semibold",
            letterSpacing: "0",
            lineHeight: "1.25",
        },
        topic: {
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            rowGap: { base: "5", lg: "0" },
            pb: {
                base: "8",
                md: "4",
            },
            alignItems: "start",
        },
        topicWithImage: {
            gridTemplateColumns: { base: "minmax(0, 1fr)", lg: "minmax(0, 0.86fr) minmax(18rem, 0.82fr)" },
            columnGap: { lg: "12", xl: "16" },
            alignItems: "center",
        },
        topicCopy: {
            minW: 0,
            display: "flex",
            flexDirection: "column",
        },
        topicCopyReverse: {
            order: { lg: 2 },
        },
        topicTitle: {
            color: "fg.subtle",
            fontFamily: "heading",
            fontSize: { base: "xl", md: "2xl" },
            fontWeight: "semibold",
            letterSpacing: "0",
            lineHeight: "1.25",
        },
        copy: {
            display: "flex",
            flexDirection: "column",
            pt: "2",
        },
        paragraph: {
            color: "fg",
            fontSize: { base: "sm", md: "md" },
            lineHeight: { base: "1.85", md: "1.9" },
        },
        media: {
            minW: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2",
            pt: {
                base: "2",
                md: "0",
            },
        },
        mediaReverse: {
            order: { lg: 1 },
        },
        image: {
            display: "block",
            w: "full",
            aspectRatio: { base: "4 / 3", md: "16 / 10" },
            maxH: { lg: "24rem" },
            objectFit: "cover",
            borderRadius: "md",
        },
        caption: {
            color: "fg.muted",
            fontSize: "xs",
            lineHeight: "1.7",
        },
        future: {
            pb: "0",
        },
    },
});

interface AboutPersonalSectionsProps {
    hobbyTitle: string;
    stories: AboutStory[];
    futureTitle: string;
    futureParagraphs: string[];
}

export default function AboutPersonalSections({
    hobbyTitle,
    stories,
    futureTitle,
    futureParagraphs,
}: AboutPersonalSectionsProps) {
    const styles = aboutPersonalSectionsStyles();

    return (
        <motion.div
            className={styles.root}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            <section className={styles.root} aria-labelledby="hobby-heading">
                <h3 id="hobby-heading" className={styles.sectionTitle}>
                    {hobbyTitle}
                </h3>
                {stories.map((story, index) => (
                    <StoryTopic key={story.id} story={story} reverse={index % 2 === 1} />
                ))}
            </section>

            <section className={`${styles.topic} ${styles.future}`} aria-labelledby="future-heading">
                <div className={styles.topicCopy}>
                    <h3 id="future-heading" className={styles.sectionTitle}>
                        {futureTitle}
                    </h3>
                    <div className={styles.copy}>
                        {futureParagraphs.map((paragraph) => (
                            <p key={paragraph} className={styles.paragraph}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

function StoryTopic({ story, reverse }: { story: AboutStory; reverse: boolean }) {
    const styles = aboutPersonalSectionsStyles();
    const rootClassName = `${styles.topic} ${styles.topicWithImage}`;
    const copyClassName = reverse ? `${styles.topicCopy} ${styles.topicCopyReverse}` : styles.topicCopy;
    const mediaClassName = reverse ? `${styles.media} ${styles.mediaReverse}` : styles.media;
    const headingId = `about-${story.id}-heading`;

    return (
        <section className={rootClassName} aria-labelledby={headingId}>
            <div className={copyClassName}>
                <h4 id={headingId} className={styles.topicTitle}>
                    {story.title}
                </h4>
                <div className={styles.copy}>
                    {story.paragraphs.map((paragraph) => (
                        <p key={paragraph} className={styles.paragraph}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            <figure className={mediaClassName}>
                <img
                    className={styles.image}
                    src={story.image.src}
                    alt={story.image.alt}
                    loading="lazy"
                    decoding="async"
                />
                <figcaption className={styles.caption}>{story.image.caption}</figcaption>
            </figure>
        </section>
    );
}
