import { Activity, Calendar, FileText, Github, Info, Layers, type LucideIcon, UserRound } from "lucide-react";
import { sva } from "styled-system/css";
import type { ProjectMetaItem } from "../-types/project";

// プロジェクト詳細ヘッダの Definition List。
// Figmaでは「Role / Stack / Year / Status」のラベル+値が罫線で区切られている。
const projectMetaListStyles = sva({
    slots: ["root", "row", "term", "termIcon", "description", "link"],
    base: {
        root: {
            w: "full",
            borderTopWidth: "1px",
            borderColor: "border.outline",
        },
        row: {
            display: "grid",
            // ラベル列は固定幅で揃え、値列は残り幅を使う
            gridTemplateColumns: "136px 1fr",
            alignItems: "center",
            minH: "10",
            color: "fg.subtle",
            borderBottomWidth: "1px",
            borderColor: "border.default",
        },
        term: {
            display: "inline-flex",
            alignItems: "center",
            gap: "3",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "fg.subtle",
        },
        termIcon: {
            flexShrink: 0,
            boxSize: "5",
            color: "fg.muted",
        },
        description: {
            fontFamily: "body",
            fontSize: "0.9rem",
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
                color: "fg.subtle",
                textDecorationColor: "colorPalette.border",
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

const metaTermIcons: Record<string, LucideIcon> = {
    Role: UserRound,
    Stack: Layers,
    Year: Calendar,
    Status: Activity,
    Document: FileText,
    Source: Github,
};

interface ProjectMetaListProps {
    items: ProjectMetaItem[];
}

export default function ProjectMetaList({ items }: ProjectMetaListProps) {
    const styles = projectMetaListStyles();

    return (
        <dl className={styles.root}>
            {items.map((item) => {
                const TermIcon = metaTermIcons[item.term] ?? Info;

                return (
                    <div key={item.term} className={styles.row}>
                        <dt className={styles.term}>
                            <TermIcon aria-hidden className={styles.termIcon} strokeWidth={1.75} />
                            {item.term}
                        </dt>
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
                );
            })}
        </dl>
    );
}
