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

interface SlideCardProps {
    slide: Slide;
    // 年内のインデックス（00始まり、2桁ゼロ詰めで表示）
    index: number;
    priority?: boolean;
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

// 右側のメタ情報「TAG · NUM」を生成する。tagが無ければ種別ラベルにフォールバック。
function formatMeta(slide: Slide): string {
    const primaryTag = slide.tags[0] ?? slide.type;
    return primaryTag.toUpperCase();
}

export default function SlideCard({ slide, index, priority = false }: SlideCardProps) {
    const styles = slideCardStyles();

    const indexLabel = String(index + 1).padStart(2, "0");
    const dateLabel = formatShortDate(slide);
    const metaLabel = formatMeta(slide);

    return (
        <div className={`group ${styles.root}`}>
            <div className={styles.main}>
                <div className={styles.left}>
                    <SlideCardBody slide={slide} indexLabel={indexLabel} dateLabel={dateLabel} />
                </div>
                <div className={styles.right}>
                    <SlideCardThumbnail slide={slide} priority={priority} metaLabel={metaLabel} />
                </div>
            </div>
        </div>
    );
}
