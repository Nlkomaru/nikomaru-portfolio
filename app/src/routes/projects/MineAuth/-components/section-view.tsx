import type { ProjectSection } from "../../-functions/parse-project-markdown";

type SectionViewStyles = Partial<
    Record<
        | "container"
        | "section"
        | "sectionWithImage"
        | "sectionImageFrame"
        | "sectionImage"
        | "sectionTitle"
        | "paragraph",
        string
    >
>;

type SectionViewProps = {
    section: ProjectSection;
    styles: SectionViewStyles;
};

const HEADING_PATTERN = /^(#{1,6})\s+(.+)$/;

function renderMarkdownBlock(markdown: string, styles: SectionViewStyles) {
    return markdown.split(/\n{2,}/).map((block) => {
        const trimmedBlock = block.trim();
        const heading = trimmedBlock.match(HEADING_PATTERN);

        if (heading) {
            const [, marker, title] = heading;
            const level = marker.length as 1 | 2 | 3 | 4 | 5 | 6;
            const HeadingTag = `h${level}` as const;

            return (
                <HeadingTag key={trimmedBlock} className={styles.sectionTitle ?? ""}>
                    {title}
                </HeadingTag>
            );
        }

        return (
            <p key={trimmedBlock} className={styles.paragraph ?? ""}>
                {trimmedBlock}
            </p>
        );
    });
}

// 1セクション分のレンダリング。layout に応じて画像と本文の並びを切り替える。
export default function SectionView({ section, styles }: SectionViewProps) {
    const hasImage = Boolean(section.image && section.layout);
    const rootClass = [styles.container, styles.section, hasImage ? styles.sectionWithImage : undefined]
        .filter(Boolean)
        .join(" ");
    const textElement = <div>{renderMarkdownBlock(section.text, styles)}</div>;

    if (!hasImage || !section.image) {
        // 画像なしのときはコンテナ幅をフルに使う1カラムグリッド。
        return <div className={rootClass}>{textElement}</div>;
    }

    const imageElement = (
        <div className={styles.sectionImageFrame ?? ""}>
            <img src={section.image.src} alt={section.image.alt} className={styles.sectionImage ?? ""} />
        </div>
    );

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
