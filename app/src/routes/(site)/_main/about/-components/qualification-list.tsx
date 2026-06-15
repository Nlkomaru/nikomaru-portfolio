import { sva } from "styled-system/css";
import type { Locale } from "../../../../../paraglide/runtime";
import { formatAboutDate } from "../-functions/format-about-date";
import type { LocalizedQualification } from "../-types/about";

const qualificationListStyles = sva({
    slots: [
        "root",
        "header",
        "eyebrow",
        "title",
        "description",
        "list",
        "item",
        "number",
        "date",
        "content",
        "name",
        "issuer",
        "empty",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "10", md: "12" },
        },
        header: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            pt: { md: "8" },
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
            maxW: "2xl",
            color: "fg.muted",
            fontSize: "sm",
            lineHeight: "1.8",
        },
        list: {
            display: "flex",
            flexDirection: "column",
            borderBottomWidth: "1px",
            borderColor: "border.default",
        },
        item: {
            display: "grid",
            gridTemplateColumns: {
                base: "4rem minmax(0, 1fr)",
                md: "6rem 12rem minmax(0, 1fr)",
            },
            columnGap: { base: "3", md: "6" },
            rowGap: { base: "1", md: "0" },
            alignItems: "center",
            py: { base: "5", md: "4" },
            borderTopWidth: "1px",
            borderColor: "border.default",
        },
        number: {
            color: "fg.muted/70",
            fontFamily: "mono",
            fontSize: { base: "sm", md: "sm" },
            fontWeight: "medium",
            letterSpacing: "0.1em",
            alignSelf: { base: "start", md: "center" },
            lineHeight: "1.6",
        },
        date: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: { base: "sm", md: "sm" },
            letterSpacing: "0.04em",
            lineHeight: "1.6",
            textTransform: "uppercase",
            gridColumn: { base: "2", md: "auto" },
        },
        content: {
            minW: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1",
            gridColumn: { base: "2", md: "auto" },
        },
        name: {
            color: "fg.subtle",
            fontSize: { base: "md", md: "lg" },
            fontWeight: "medium",
            letterSpacing: "-0.015em",
            lineHeight: "1.5",
        },
        issuer: {
            color: "fg.muted",
            fontSize: { base: "xs", md: "sm" },
            lineHeight: "1.6",
        },
        empty: {
            borderBlockWidth: "1px",
            borderColor: "border.default",
            py: "8",
            color: "fg.muted",
            fontSize: "sm",
        },
    },
});

interface QualificationListProps {
    title: string;
    description: string;
    emptyLabel: string;
    locale: Locale;
    items: LocalizedQualification[];
}

export default function QualificationList({ title, description, emptyLabel, locale, items }: QualificationListProps) {
    const styles = qualificationListStyles();

    return (
        <section className={styles.root} aria-labelledby="qualification-heading">
            <header className={styles.header}>
                <p className={styles.eyebrow}>— Certifications</p>
                <h2 id="qualification-heading" className={styles.title}>
                    {title}
                </h2>
                <p className={styles.description}>{description}</p>
            </header>

            {items.length === 0 ? (
                <p className={styles.empty}>{emptyLabel}</p>
            ) : (
                <ol className={styles.list}>
                    {items.map((item, index) => (
                        <li key={item.id} className={styles.item}>
                            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                            <time className={styles.date}>{formatAboutDate(item.acquiredAt, locale)}</time>
                            <div className={styles.content}>
                                <h3 className={styles.name}>{item.name}</h3>
                                <p className={styles.issuer}>{item.issuer}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}
