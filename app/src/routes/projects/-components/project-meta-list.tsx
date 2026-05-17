import { sva } from "styled-system/css";
import type { ProjectMetaItem } from "../-types/project";

// プロジェクト詳細ヘッダの Definition List。
// Figmaでは「Role / Stack / Year / Status」のラベル+値が罫線で区切られている。
const projectMetaListStyles = sva({
    slots: ["root", "row", "term", "description", "link"],
    base: {
        root: {
            w: "full",
            borderTopWidth: "1px",
            borderColor: "border.outline",
        },
        row: {
            display: "grid",
            // ラベル列は固定幅で揃え、値列は残り幅を使う
            gridTemplateColumns: "96px 1fr",
            alignItems: "center",
            minH: "9",
            color: "fg.subtle",
            borderBottomWidth: "1px",
            borderColor: "border.default",
        },
        term: {
            fontFamily: "mono",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "fg.muted",
        },
        description: {
            fontFamily: "body",
            fontSize: "13px",
            lineHeight: "1.5",
        },
        // 値が href を持つ場合のリンク表示。
        // 過剰な装飾は避けて、下線のみで「リンクである」ことを伝える。
        link: {
            color: "fg.subtle",
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationThickness: "2px",
            textUnderlineOffset: "2px",
            textDecorationColor: "border.outline",
            transition: "color 0.2s ease, text-decoration-color 0.2s ease",
            _hover: {
                color: "fg",
                textDecorationColor: "fg",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "2px",
                borderRadius: "xs",
            },
        },
    },
});

interface ProjectMetaListProps {
    items: ProjectMetaItem[];
}

export default function ProjectMetaList({ items }: ProjectMetaListProps) {
    const styles = projectMetaListStyles();

    return (
        <dl className={styles.root}>
            {items.map((item) => (
                <div key={item.term} className={styles.row}>
                    <dt className={styles.term}>{item.term}</dt>
                    <dd className={styles.description}>
                        {item.href ? (
                            <a
                                href={item.href}
                                className={styles.link}
                                {...(item.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                            >
                                {item.description}
                            </a>
                        ) : (
                            item.description
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
