import { useEffect, useRef } from "react";
import { sva } from "styled-system/css";
import { getBlurhashBackground } from "@/routes/-functions/blurhash-background";
import type { Slide } from "../-types/slide";

const slideCardThumbnailStyles = sva({
    slots: ["metaText", "imageLink", "image", "fallback"],
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
            borderWidth: "1px",
            borderColor: "border.default",
            overflow: "hidden",
            lineHeight: 0,
            textDecoration: "none",
            color: "inherit",
            outline: "none",
            transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
            _hover: {
                // transform: "translateY(-1px)",
                boxShadow: "sm",
                // "& img": {
                //     opacity: 1,
                //     transform: "scale(1.03)",
                // },
            },
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
            transition: "opacity 0.18s ease, transform 0.18s ease",
            pointerEvents: "none",
        },
        fallback: {
            position: "absolute",
            inset: 0,
            bg: "bg.muted",
            pointerEvents: "none",
        },
    },
});

interface SlideCardThumbnailProps {
    slide: Slide;
    metaLabel: string;
    onReady?: () => void;
}

export default function SlideCardThumbnail({ slide, metaLabel, onReady }: SlideCardThumbnailProps) {
    const styles = slideCardThumbnailStyles();
    const imageRef = useRef<HTMLImageElement | null>(null);
    const fallbackStyle = slide.thumbnailBlurhash ? getBlurhashBackground(slide.thumbnailBlurhash) : undefined;

    useEffect(() => {
        const image = imageRef.current;
        if (image?.complete && image.naturalWidth > 0) {
            onReady?.();
        }
    }, [onReady]);

    return (
        <>
            <span className={styles.metaText}>{metaLabel}</span>
            <a
                href={slide.slideUrl}
                className={styles.imageLink}
                target={"_blank"}
                rel={"noopener noreferrer"}
                aria-label={`${slide.title} — open slides`}
            >
                <span className={styles.fallback} style={fallbackStyle} aria-hidden="true" />
                {slide.thumbnailImage ? (
                    <img
                        ref={imageRef}
                        src={slide.thumbnailImage}
                        alt=""
                        width={576}
                        height={324}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="auto"
                        className={styles.image}
                        onLoad={onReady}
                        onError={onReady}
                    />
                ) : null}
            </a>
        </>
    );
}
