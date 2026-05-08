import type { ProjectSection } from "../../-functions/parse-project-markdown";

type SectionViewStyles = Partial<
    Record<"container" | "section" | "sectionWithImage" | "sectionImage" | "paragraph", string>
>;

type SectionViewProps = {
    section: ProjectSection;
    styles: SectionViewStyles;
};

// 1セクション分のレンダリング。layout に応じて画像と本文の並びを切り替える。
export default function SectionView({ section, styles }: SectionViewProps) {
    const hasImage = Boolean(section.image && section.layout);
    const rootClass = [styles.container, styles.section, hasImage ? styles.sectionWithImage : undefined]
        .filter(Boolean)
        .join(" ");
    const textElement = <p className={styles.paragraph ?? ""}>{section.text}</p>;

    if (!hasImage || !section.image) {
        // 画像なしのときはコンテナ幅をフルに使う1カラムグリッド。
        return <div className={rootClass}>{textElement}</div>;
    }

    const imageElement = <img src={section.image.src} alt={section.image.alt} className={styles.sectionImage ?? ""} />;

    return (
        <div className={rootClass}>
            {section.layout === "left-image" ? (
                <>
                    {imageElement}
                    {textElement}
                </>
            ) : (
                <>
                    {textElement}
                    {imageElement}
                </>
            )}
        </div>
    );
}
