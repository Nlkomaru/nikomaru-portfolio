import { sva } from "styled-system/css";
import type { Slide } from "../-types/slide";

const slideCardBodyStyles = sva({
    slots: ["indexCol", "indexText", "dateCol", "dateText", "textCol", "titleText", "linkRow", "linkText", "textLink"],
    base: {
        indexCol: {
            display: { base: "none", md: "flex" },
            alignItems: "center",
            w: "14",
            flexShrink: 0,
        },
        indexText: {
            color: "fg.subtle",
            fontFamily: "mono",
            fontSize: { base: "2xs", md: "xs" },
            letterSpacing: "0.1em",
        },
        dateCol: {
            display: { base: "none", sm: "flex" },
            alignItems: "center",
            w: { sm: "22", md: "36", lg: "40" },
            flexShrink: 0,
        },
        dateText: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: { base: "2xs", md: "xs" },
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        },
        textCol: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.5",
            minWidth: 0,
            flex: "1 1 auto",
        },
        titleText: {
            color: "fg.subtle",
            fontSize: { base: "sm", md: "md", lg: "lg" },
            fontWeight: "medium",
            lineHeight: "1.35",
            letterSpacing: "-0.025em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            width: "full",
            transition: "opacity 0.15s ease",
            _hover: {
                opacity: 0.72,
            },
        },
        linkRow: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "2",
        },
        linkText: {
            fontSize: { base: "xs", md: "sm" },
            lineHeight: "1.45",
            color: "fg.muted",
        },
        textLink: {
            fontSize: { base: "xs", md: "sm" },
            lineHeight: "1.45",
            color: "fg",
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationThickness: "1.5px",
            textUnderlineOffset: "2px",
            textDecorationColor: "border.outline",
            transition: "color 0.2s ease, text-decoration-color 0.2s ease",
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "2px",
                borderRadius: "xs",
            },
            _hover: {
                color: "fg",
                textDecorationColor: "fg",
            },
        },
    },
});

interface SlideCardBodyProps {
    slide: Slide;
    indexLabel: string;
    dateLabel: string;
}

export default function SlideCardBody({ slide, indexLabel, dateLabel }: SlideCardBodyProps) {
    const styles = slideCardBodyStyles();
    const hasPresentationLink = slide.presentationName && slide.presentationUrl;

    return (
        <>
            <div className={styles.indexCol}>
                <span className={styles.indexText}>{indexLabel}</span>
            </div>
            <div className={styles.dateCol}>
                <span className={styles.dateText}>{dateLabel}</span>
            </div>
            <div className={styles.textCol}>
                <a href={slide.slideUrl} className={styles.titleText} target={"_blank"} rel={"noopener noreferrer"}>
                    {slide.title}
                </a>
                <div className={styles.linkRow}>
                    {hasPresentationLink ? (
                        <a
                            href={slide.presentationUrl}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                            className={styles.textLink}
                        >
                            {slide.presentationName}
                        </a>
                    ) : slide.presentationName ? (
                        <p className={styles.linkText}>{slide.presentationName}</p>
                    ) : null}
                </div>
            </div>
        </>
    );
}
