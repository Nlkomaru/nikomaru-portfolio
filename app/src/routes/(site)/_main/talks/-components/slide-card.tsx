import { motion, useInView } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { sva } from "styled-system/css";
import type { Slide } from "../-types/slide";
import SlideCardBody from "./slide-card-body";
import SlideCardThumbnail from "./slide-card-thumbnail";

// Figmaの「SlideCard」行コンポーネント。アーカイブ一覧の1行を表現する。
const slideCardStyles = sva({
    slots: ["root", "main", "left", "right"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            w: "full",
            py: { base: "2", md: "3" },
            px: { base: "1", md: "2" },
            borderTopWidth: "1px",
            borderColor: "border.muted",
        },
        main: {
            display: "flex",
            flex: "1 0 0",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: 0,
            gap: { base: "3", md: "4" },
        },
        left: {
            display: "flex",
            alignItems: "center",
            gap: { base: "3", md: "4", lg: "5" },
            minWidth: 0,
            flex: "1 1 auto",
        },
        right: {
            display: "flex",
            alignItems: "center",
            gap: { base: "4", md: "6", lg: "8" },
            flexShrink: 0,
        },
    },
});

const slideCardMotion = {
    hidden: { opacity: 0, x: -16 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

interface SlideCardProps {
    slide: Slide;
    // 年内のインデックス（00始まり、2桁ゼロ詰めで表示）
    index: number;
}

// 短い「FEB 12」形式の日付ラベルを生成する。プレゼン日が無ければ最終更新日を使う。
function formatShortDate(slide: Slide): string {
    const raw = slide.presentationDate ?? slide.lastUpdate;
    if (!raw) {
        return "—";
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
        return "—";
    }
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    return `${month} ${day}`;
}

// 右側のメタ情報にはページ数を表示する。
function formatMeta(slide: Slide): string {
    return `${slide.pageCount}P`;
}

export default function SlideCard({ slide, index }: SlideCardProps) {
    const styles = slideCardStyles();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(!slide.thumbnailImage);
    const markReady = useCallback(() => setReady(true), []);
    const inView = useInView(rootRef, { once: true, margin: "-8% 0px" });

    const indexLabel = String(index + 1).padStart(2, "0");
    const dateLabel = formatShortDate(slide);
    const metaLabel = formatMeta(slide);

    return (
        <motion.div
            ref={rootRef}
            className={`group ${styles.root}`}
            variants={slideCardMotion}
            initial="hidden"
            animate={ready && inView ? "show" : "hidden"}
            layout="position"
        >
            <div className={styles.main}>
                <div className={styles.left}>
                    <SlideCardBody slide={slide} indexLabel={indexLabel} dateLabel={dateLabel} />
                </div>
                <div className={styles.right}>
                    <SlideCardThumbnail slide={slide} metaLabel={metaLabel} onReady={markReady} />
                </div>
            </div>
        </motion.div>
    );
}
