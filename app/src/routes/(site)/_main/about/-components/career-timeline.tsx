import { sva } from "styled-system/css";
import type { Locale } from "../../../../../paraglide/runtime";
import { formatAboutPeriod } from "../-functions/format-about-date";
import type { LocalizedCareer } from "../-types/about";

const careerTimelineStyles = sva({
    slots: [
        "root",
        "header",
        "eyebrow",
        "title",
        "description",
        "list",
        "item",
        "period",
        "marker",
        "indicator",
        "content",
        "number",
        "itemTitle",
        "itemDescription",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "8",
        },
        header: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
        },
        eyebrow: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: "2xs",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
        },
        title: {
            color: "fg.subtle",
            fontFamily: "heading",
            fontSize: { base: "3xl", md: "5xl" },
            fontWeight: "semibold",
            letterSpacing: "-0.025em",
            lineHeight: "1.2",
        },
        description: {
            color: "fg.muted",
            fontSize: { base: "sm", md: "md" },
            lineHeight: "1.9",
        },
        list: {
            display: "flex",
            flexDirection: "column",
        },
        item: {
            display: "grid",
            gridTemplateColumns: { base: "0.75rem minmax(0, 1fr)", md: "12rem 2rem minmax(0, 1fr)" },
            gridTemplateAreas: {
                base: '"marker period" "marker content"',
                md: '"period marker content"',
            },
            columnGap: { base: "2", md: "5" },
        },
        period: {
            gridArea: "period",
            pt: { base: "0", md: "1.5" },
            pb: { base: "1.5", md: "0" },
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: { base: "sm", md: "xs" },
            letterSpacing: { base: "0.04em", md: "0.08em" },
            lineHeight: "1.65",
            textAlign: { base: "left", md: "right" },
            textTransform: "uppercase",
        },
        marker: {
            gridArea: "marker",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            _after: {
                content: '""',
                position: "absolute",
                insetBlockStart: "3",
                insetBlockEnd: "0",
                w: "1px",
                bg: "border.default",
            },
        },
        indicator: {
            position: "relative",
            zIndex: "base",
            boxSize: "2.5",
            mt: "2",
            borderWidth: "1px",
            borderColor: "fg.subtle",
            borderRadius: "full",
            bg: "bg.canvas",
        },
        content: {
            gridArea: "content",
            minW: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1.5",
            pt: "2",
            pb: { base: "7", md: "6" },
            borderBottomWidth: {
                base: "none",
                md: "1px",
            },
            borderColor: "border.default",
        },
        number: {
            color: "fg.muted/70",
            fontFamily: "mono",
            fontSize: "2xs",
            display: {
                base: "none",
                md: "inline-block",
            },
            letterSpacing: "0.1em",
        },
        itemTitle: {
            color: "fg.subtle",
            fontSize: { base: "md", md: "lg" },
            fontWeight: "medium",
            letterSpacing: "-0.015em",
            lineHeight: "1.4",
        },
        itemDescription: {
            color: "fg.muted",
            fontSize: { base: "xs", md: "sm" },
            lineHeight: "1.8",
        },
    },
});

interface CareerTimelineProps {
    title: string;
    description: string;
    presentLabel: string;
    locale: Locale;
    items: LocalizedCareer[];
}

export default function CareerTimeline({ title, description, presentLabel, locale, items }: CareerTimelineProps) {
    const styles = careerTimelineStyles();

    return (
        <section className={styles.root} aria-labelledby="career-heading">
            <header className={styles.header}>
                <p className={styles.eyebrow}>— Career</p>
                <h2 id="career-heading" className={styles.title}>
                    {title}
                </h2>
                <p className={styles.description}>{description}</p>
            </header>

            <ol className={styles.list}>
                {items.map((item, index) => (
                    <li key={item.id} className={styles.item}>
                        <time className={styles.period}>
                            {formatAboutPeriod(item.startDate, item.endDate, locale, presentLabel)}
                        </time>
                        <div className={styles.marker} aria-hidden>
                            <span className={styles.indicator} />
                        </div>
                        <article className={styles.content}>
                            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemDescription}>{item.description}</p>
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    );
}
