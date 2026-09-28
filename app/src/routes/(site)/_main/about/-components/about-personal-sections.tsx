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
            // Different paragraph lengths can grow independently of the uncropped photo.
            alignItems: { base: "start", lg: "center" },
        },
        topicWithImage: {
            // Cap the whole section so wider screens do not force an oversized photo.
            maxW: { lg: "65rem" },
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

// Text wraps at different widths in each language, so measure both columns rather than
// stretching or cropping the 3:2 photo. Favor an image no taller than the copy.
function fitStoryColumns(section: HTMLElement, copy: HTMLElement, media: HTMLElement, reverse: boolean) {
    const gap = Number.parseFloat(getComputedStyle(section).columnGap) || 0;
    const availableWidth = section.clientWidth - gap;
    if (availableWidth <= 0) {
        return;
    }
    const maxImageWidth = availableWidth / 2;
    const minImageWidth = Math.min(192, maxImageWidth);
    let bestWidth = minImageWidth;
    let smallestGap = Number.POSITIVE_INFINITY;

    const measure = (imageWidth: number) => {
        section.style.gridTemplateColumns = reverse
            ? `minmax(0, ${imageWidth}px) minmax(0, 1fr)`
            : `minmax(0, 1fr) minmax(0, ${imageWidth}px)`;
        const heightGap = copy.getBoundingClientRect().height - media.getBoundingClientRect().height;
        if (heightGap >= 0 && heightGap < smallestGap) {
            bestWidth = imageWidth;
            smallestGap = heightGap;
        }
    };

    // Paragraph wrapping creates discrete height jumps; sample across the available width
    // before refining the closest fit instead of assuming a monotonic text height.
    for (let width = minImageWidth; width <= maxImageWidth && smallestGap >= 1; width += 24) {
        measure(width);
    }
    if (smallestGap >= 1) {
        measure(maxImageWidth);
        const coarseWidth = bestWidth;
        for (
            let width = Math.max(minImageWidth, coarseWidth - 24);
            width <= Math.min(maxImageWidth, coarseWidth + 24) && smallestGap >= 1;
            width += 2
        ) {
            measure(width);
        }
    }
    measure(bestWidth);
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
        if (!section || !copy || !media) {
            return;
        }

        const desktop = window.matchMedia("(min-width: 64rem)");
        const alignColumns = () => {
            if (desktop.matches) {
                fitStoryColumns(section, copy, media, reverse);
            } else {
                section.style.removeProperty("grid-template-columns");
            }
        };
        let lastWidth = section.clientWidth;
        let lastGap = getComputedStyle(section).columnGap;
        alignColumns();
        const onResize = () => {
            const width = section.clientWidth;
            const gap = getComputedStyle(section).columnGap;
            // The xl breakpoint changes the gap even after max-width caps the section.
            if (width !== lastWidth || gap !== lastGap) {
                lastWidth = width;
                lastGap = gap;
                alignColumns();
            }
        };
        const observer = new ResizeObserver(onResize);
        observer.observe(section);
        window.addEventListener("resize", onResize);
        desktop.addEventListener("change", alignColumns);

        // Web fonts may change wrapping after the first layout pass.
        let active = true;
        void document.fonts.ready.then(() => {
            if (active) {
                alignColumns();
            }
        });
        return () => {
            active = false;
            observer.disconnect();
            desktop.removeEventListener("change", alignColumns);
            window.removeEventListener("resize", onResize);
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
