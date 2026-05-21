import { sva } from "styled-system/css";
import { m } from "../../../../../paraglide/messages";
import type { ProjectSection as ProjectSectionData } from "../-functions/parse-project-markdown";
import ProjectImagePreview from "./project-image-preview";
import ProjectMarkdown from "./project-markdown";

const projectSectionStyles = sva({
    slots: [
        "section",
        "sectionWithImage",
        "divider",
        "imageFrame",
        "imageCaption",
        "leftImageCellImage",
        "leftImageCellMarkdown",
    ],
    base: {
        section: {
            display: "grid",
            gridTemplateColumns: "1fr",
            columnGap: "10",
            rowGap: { base: "6", lg: "0" },
            alignItems: "start",
        },
        sectionWithImage: {
            gridTemplateColumns: { base: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
            alignItems: "center",
        },
        divider: {
            gridColumn: "1 / -1",
            w: "full",
            mb: { base: "0", lg: "8" },
            borderWidth: "0",
            borderTopWidth: "1px",
            borderColor: "border.default",
        },
        imageFrame: {
            m: "0",
            mt: "2",
            display: "flex",
            flexDirection: "column",
            gap: "3",
        },
        imageCaption: {
            fontSize: "sm",
            color: "fg.muted",
        },
        leftImageCellImage: {
            minW: "0",
            order: { base: 2, lg: 1 },
        },
        leftImageCellMarkdown: {
            minW: "0",
            order: { base: 1, lg: 2 },
        },
    },
});

type ProjectSectionProps = {
    section: ProjectSectionData;
    imageNumber?: number;
    showDividerBefore?: boolean;
};

// 通常 Markdown と旧 image/layout 指定を同じ表示面で扱う。
export default function ProjectSection({ section, imageNumber, showDividerBefore = false }: ProjectSectionProps) {
    const styles = projectSectionStyles();
    const hasImageLayout = Boolean(section.image && section.layout);
    const rootClassName = [styles.section, hasImageLayout ? styles.sectionWithImage : undefined]
        .filter(Boolean)
        .join(" ");
    const dividerElement = showDividerBefore ? <hr className={styles.divider} /> : null;
    const markdownElement = <ProjectMarkdown markdown={section.text} />;

    if (!hasImageLayout || !section.image) {
        return (
            <section className={rootClassName}>
                {dividerElement}
                {markdownElement}
            </section>
        );
    }

    const imageElement = (
        <figure className={styles.imageFrame}>
            <ProjectImagePreview src={section.image.src} alt={section.image.alt} />
            <figcaption className={styles.imageCaption}>
                {m["projects.image.figureLabel"]()}
                {imageNumber ?? 1}: {section.image.caption ?? section.image.alt}
            </figcaption>
        </figure>
    );

    return (
        <section className={rootClassName}>
            {dividerElement}
            {section.layout === "left-image" ? (
                <>
                    <div className={styles.leftImageCellImage}>{imageElement}</div>
                    <div className={styles.leftImageCellMarkdown}>{markdownElement}</div>
                </>
            ) : (
                <>
                    {markdownElement}
                    {imageElement}
                </>
            )}
        </section>
    );
}
