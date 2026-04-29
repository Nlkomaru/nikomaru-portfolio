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
            fontSize: { base: "sm", md: "md", lg: "lg" },
            fontWeight: "medium",
            color: "fg.default",
            lineHeight: "1.35",
            letterSpacing: "-0.025em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            width: "full",
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
            color: "fg.default",
            textDecorationLine: "underline",
            textDecorationThickness: "1px",
            textUnderlineOffset: "0.22em",
            textDecorationColor: "currentColor",
            outline: "none",
            transition: "color 0.15s ease, opacity 0.15s ease",
            _focusVisible: {
                boxShadow: "0 2px 0 0 token(colors.border.outline)",
            },
            _hover: {
                opacity: 0.7,
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
    const presentationOpensInNewTab = slide.presentationUrl ? /^https?:\/\//.test(slide.presentationUrl) : false;

    return (
        <>
            <div className={styles.indexCol}>
                <span className={styles.indexText}>{indexLabel}</span>
            </div>
            <div className={styles.dateCol}>
                <span className={styles.dateText}>{dateLabel}</span>
            </div>
            <div className={styles.textCol}>
                <p className={styles.titleText}>{slide.title}</p>
                <div className={styles.linkRow}>
                    {hasPresentationLink ? (
                        <a
                            href={slide.presentationUrl}
                            target={presentationOpensInNewTab ? "_blank" : undefined}
                            rel={presentationOpensInNewTab ? "noopener noreferrer" : undefined}
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
