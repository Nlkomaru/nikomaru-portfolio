import { motion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { sva } from "styled-system/css";
import { getLocale } from "../../../../../paraglide/runtime";
import type { AboutStory } from "../-types/about";
import AboutMarkdown from "./about-markdown";

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
        "media",
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
            w: "full",
            gridTemplateColumns: { base: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" },
            columnGap: { lg: "10", xl: "14" },
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
        media: {
            minW: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2",
            pt: { base: "2", md: "0" },
        },
        mediaReverse: {
            order: { lg: 1 },
        },
        image: {
            display: "block",
            w: "full",
            // Reserve the photos' 3:2 space before loading; use their intrinsic ratio once loaded.
            aspectRatio: "auto 3 / 2",
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

// Keep the section at full width; only the image track shrinks as its adjacent copy expands.
function fitImageColumn(section: HTMLElement, copy: HTMLElement, media: HTMLElement, reverse: boolean) {
    const gap = Number.parseFloat(getComputedStyle(section).columnGap);
    const maxImageWidth = (section.clientWidth - gap) / 2;
    let bestWidth = maxImageWidth;
    let closestGap = Number.POSITIVE_INFINITY;

    // Text wraps in whole lines, so try widths from largest to smallest and keep
    // the widest close match rather than assuming that the heights vary smoothly.
    for (let width = maxImageWidth; width >= Math.min(120, maxImageWidth); width -= 4) {
        section.style.gridTemplateColumns = reverse ? `${width}px minmax(0, 1fr)` : `minmax(0, 1fr) ${width}px`;
        const heightGap = Math.abs(copy.getBoundingClientRect().height - media.getBoundingClientRect().height);
        if (heightGap < closestGap) {
            bestWidth = width;
            closestGap = heightGap;
        }
        if (heightGap <= 16) {
            break;
        }
    }
    section.style.gridTemplateColumns = reverse ? `${bestWidth}px minmax(0, 1fr)` : `minmax(0, 1fr) ${bestWidth}px`;
}

interface AboutPersonalSectionsProps {
    hobbyTitle: string;
    stories: AboutStory[];
    futureTitle: string;
    future: string;
}

export default function AboutPersonalSections({
    hobbyTitle,
    stories,
    futureTitle,
    future,
}: AboutPersonalSectionsProps) {
    const styles = aboutPersonalSectionsStyles();
    const locale = getLocale();

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
                    <StoryTopic key={`${locale}-${story.id}`} story={story} reverse={index % 2 === 1} />
                ))}
            </section>

            <section className={`${styles.topic} ${styles.future}`} aria-labelledby="future-heading">
                <div className={styles.topicCopy}>
                    <h3 id="future-heading" className={styles.sectionTitle}>
                        {futureTitle}
                    </h3>
                    <div className={styles.copy}>
                        <AboutMarkdown markdown={future} />
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
    const sectionRef = useRef<HTMLElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const copy = copyRef.current;
        const media = mediaRef.current;
        const container = section?.parentElement;
        if (!section || !copy || !media || !container) {
            return;
        }

        const desktop = window.matchMedia("(min-width: 64rem)");
        const alignColumns = () => {
            if (desktop.matches) {
                fitImageColumn(section, copy, media, reverse);
            } else {
                section.style.removeProperty("grid-template-columns");
            }
        };
        let lastWidth = container.clientWidth;
        let lastGap = getComputedStyle(section).columnGap;
        alignColumns();
        const onResize = () => {
            const width = container.clientWidth;
            const gap = getComputedStyle(section).columnGap;
            if (width !== lastWidth || gap !== lastGap) {
                lastWidth = width;
                lastGap = gap;
                alignColumns();
            }
        };
        const observer = new ResizeObserver(onResize);
        observer.observe(container);
        window.addEventListener("resize", onResize);
        desktop.addEventListener("change", alignColumns);

        // Loading web fonts changes wrapping even when the container width stays constant.
        let active = true;
        void document.fonts.ready.then(() => {
            if (active) {
                alignColumns();
            }
        });
        return () => {
            active = false;
            observer.disconnect();
            window.removeEventListener("resize", onResize);
            desktop.removeEventListener("change", alignColumns);
            section.style.removeProperty("grid-template-columns");
        };
    }, [reverse]);

    return (
        <section ref={sectionRef} className={rootClassName} aria-labelledby={headingId}>
            <div ref={copyRef} className={copyClassName}>
                <h4 id={headingId} className={styles.topicTitle}>
                    {story.title}
                </h4>
                <div className={styles.copy}>
                    <AboutMarkdown markdown={story.body} />
                </div>
            </div>

            <figure ref={mediaRef} className={mediaClassName}>
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
