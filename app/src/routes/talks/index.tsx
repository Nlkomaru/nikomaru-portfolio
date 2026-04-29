import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { sva } from "styled-system/css";
import { m } from "../../paraglide/messages";
import TalksYearGroup from "./-components/talks-year-group";
import { getSlides } from "./-functions/get-slides";
import type { Slide } from "./-types/slide";

// Figma「Presentation history」アーカイブ画面のレイアウト定義。
const talksPageStyles = sva({
    slots: [
        "root",
        "container",
        "header",
        "headerEyebrow",
        "headerTitle",
        "headerDescription",
        "controls",
        "controlsCount",
        "search",
        "searchIcon",
        "searchInput",
        "yearList",
        "footer",
        "footerText",
        "empty",
    ],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
            color: "fg.default",
        },
        container: {
            maxW: "7xl",
            mx: "auto",
            px: { base: "6", md: "12" },
            py: { base: "12", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: { base: "14", md: "20" },
        },
        header: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
        },
        headerEyebrow: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: "0.6875rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
        },
        headerTitle: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: { base: "3xl", md: "4xl" },
            lineHeight: "1.05",
            letterSpacing: "-0.025em",
            color: "fg.default",
        },
        headerDescription: {
            maxW: "xl",
            color: "fg.subtle",
            fontSize: { base: "md", md: "lg" },
            lineHeight: "1.65",
        },
        controls: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4",
            w: "full",
            borderBottomWidth: "1px",
            borderColor: "border.muted",
        },
        controlsCount: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: "xs",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        },
        search: {
            display: "flex",
            alignItems: "center",
            gap: "3",
            w: { base: "52", md: "72" },
            h: "9",
            pl: "3",
            pr: "2",
            borderBottomWidth: "1px",
            borderColor: "border.default",
        },
        searchIcon: {
            flexShrink: 0,
            color: "fg.subtle",
            w: "4",
            h: "4",
        },
        searchInput: {
            w: "full",
            bg: "transparent",
            border: "none",
            outline: "none",
            color: "fg.default",
            fontSize: { base: "sm", md: "md" },
            _placeholder: {
                color: "fg.subtle",
            },
        },
        yearList: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "14", md: "20" },
        },
        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
            pt: "8",
            px: { base: "1", md: "2" },

            borderTopWidth: "1px",
            borderColor: "border.muted",
        },
        footerText: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: "xs",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        },
        empty: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: "0.75rem",
            textAlign: "center",
            py: "10",
        },
    },
});

export const Route = createFileRoute("/talks/")({
    loader: () => getSlides(),
    staleTime: 1000 * 60 * 5,
    component: SlidesPage,
});

// スライドからグルーピング用の年を取り出す（プレゼン日 > 最終更新日の優先順）。
function pickYear(slide: Slide): number {
    const raw = slide.presentationDate ?? slide.lastUpdate;
    if (!raw) {
        return new Date().getFullYear();
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
        return new Date().getFullYear();
    }
    return date.getFullYear();
}

// 全件を年ごとにグルーピングする。並びは新しい年が先頭に来るように降順で返す。
function groupByYear(slides: Slide[]): Array<{ year: number; items: Slide[] }> {
    const buckets = new Map<number, Slide[]>();
    for (const slide of slides) {
        const year = pickYear(slide);
        const list = buckets.get(year) ?? [];
        list.push(slide);
        buckets.set(year, list);
    }
    return Array.from(buckets.entries())
        .map(([year, items]) => ({ year, items }))
        .sort((a, b) => b.year - a.year);
}

// 表示桁数を揃えた件数ラベル（"03 ITEMS" / "12 ENTRIES" 風）を生成する。
function formatCountLabel(count: number, suffix: string): string {
    return `${String(count).padStart(2, "0")} ${suffix}`;
}

function SlidesPage() {
    const slides = Route.useLoaderData() as Slide[];
    const styles = talksPageStyles();
    const [query, setQuery] = useState("");

    // 公開済みスライドのみ表示する（draftは含めるがprivateは事前に除外済み）。
    const publicSlides = useMemo(() => slides.filter((slide) => slide.type === "public"), [slides]);

    // 検索クエリ（タイトル / プレゼン名 / タグ）でフィルタ。
    const filteredSlides = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (normalized.length === 0) {
            return publicSlides;
        }
        return publicSlides.filter((slide) => {
            const haystack = [slide.title, slide.presentationName ?? "", ...slide.tags].join(" ").toLowerCase();
            return haystack.includes(normalized);
        });
    }, [publicSlides, query]);

    const groups = useMemo(() => groupByYear(filteredSlides), [filteredSlides]);

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <p className={styles.headerEyebrow}>{m["talks.archiveEyebrow"]()}</p>
                    <h1 className={styles.headerTitle}>{m["talks.archiveTitle"]()}</h1>
                    <p className={styles.headerDescription}>{m["talks.archiveDescription"]()}</p>
                </header>

                <div className={styles.controls}>
                    <span className={styles.controlsCount}>{formatCountLabel(publicSlides.length, "Items")}</span>
                    <div className={styles.search}>
                        <Search className={styles.searchIcon} aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={m["talks.searchPlaceholder"]()}
                            className={styles.searchInput}
                            aria-label={m["talks.searchPlaceholder"]()}
                        />
                    </div>
                </div>

                <div className={styles.yearList}>
                    {groups.length === 0 ? (
                        <p className={styles.empty}>— No entries —</p>
                    ) : (
                        groups.map(({ year, items }) => (
                            <TalksYearGroup
                                key={year}
                                year={year}
                                slides={items}
                                countLabel={formatCountLabel(items.length, "Entries")}
                            />
                        ))
                    )}
                </div>

                <footer className={styles.footer}>
                    <span className={styles.footerText}>{m["talks.footerLeft"]()}</span>
                    <span className={styles.footerText}>{m["talks.footerRight"]()}</span>
                </footer>
            </div>
        </div>
    );
}
