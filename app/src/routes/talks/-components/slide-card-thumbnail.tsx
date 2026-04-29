import { sva } from "styled-system/css";
import type { Slide } from "../-types/slide";

const slideCardThumbnailStyles = sva({
    slots: ["metaText", "imageLink", "image"],
    base: {
        metaText: {
            display: { base: "none", md: "block" },
            color: "fg.subtle",
            fontFamily: "mono",
            fontSize: { base: "2xs", lg: "xs" },
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "right",
            whiteSpace: "nowrap",
        },
        imageLink: {
            position: "relative",
            display: "block",
            w: { base: "32", md: "40", lg: "44" },
            flexShrink: 0,
            aspectRatio: "16 / 9",
            bg: "bg.muted",
            borderRadius: "md",
            overflow: "hidden",
            lineHeight: 0,
            textDecoration: "none",
            color: "inherit",
            outline: "none",
            _focusVisible: {
                boxShadow: "0 0 0 2px token(colors.bg.canvas), 0 0 0 4px token(colors.border.outline)",
            },
        },
        image: {
            position: "absolute",
            inset: 0,
            w: "full",
            h: "full",
            objectFit: "cover",
            opacity: 0.85,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
        },
    },
});

interface SlideCardThumbnailProps {
    slide: Slide;
    priority: boolean;
    metaLabel: string;
}

export default function SlideCardThumbnail({ slide, priority, metaLabel }: SlideCardThumbnailProps) {
    const styles = slideCardThumbnailStyles();

    return (
        <>
            <span className={styles.metaText}>{metaLabel}</span>
            <a href={slide.slideUrl} className={styles.imageLink} aria-label={`${slide.title} — open slides`}>
                <img
                    src={slide.image}
                    alt=""
                    width={576}
                    height={324}
                    loading={priority ? "eager" : "lazy"}
                    decoding={priority ? "sync" : "async"}
                    fetchPriority={priority ? "high" : "auto"}
                    className={styles.image}
                />
            </a>
        </>
    );
}
