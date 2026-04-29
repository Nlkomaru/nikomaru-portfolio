import { sva } from "styled-system/css";
import type { Slide } from "../-types/slide";
import SlideCard from "./slide-card";

const talksYearGroupStyles = sva({
    slots: ["group", "header", "yearLabel", "count", "body"],
    base: {
        group: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
        },
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
            pr: { base: "1", md: "2" },
        },
        yearLabel: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: { base: "3xl", md: "4xl", lg: "5xl" },
            lineHeight: "1",
            letterSpacing: "-0.035em",
            color: "fg.default",
        },
        count: {
            color: "fg.subtle",
            fontFamily: "mono",
            fontSize: { base: "2xs", md: "xs" },
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        },
        body: {
            display: "flex",
            flexDirection: "column",
            p: 0,
            borderBottomWidth: "1px",
            borderColor: "border.muted",
        },
    },
});

interface TalksYearGroupProps {
    year: number;
    slides: Slide[];
    countLabel: string;
}

export default function TalksYearGroup({ year, slides, countLabel }: TalksYearGroupProps) {
    const styles = talksYearGroupStyles();

    return (
        <section className={styles.group}>
            <div className={styles.header}>
                <h2 className={styles.yearLabel}>{year}</h2>
                <span className={styles.count}>{countLabel}</span>
            </div>
            <div className={styles.body}>
                {slides.map((slide, index) => (
                    <SlideCard key={slide.id} slide={slide} index={index} priority={index === 0} />
                ))}
            </div>
        </section>
    );
}
