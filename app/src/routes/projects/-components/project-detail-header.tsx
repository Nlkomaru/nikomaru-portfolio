import { sva } from "styled-system/css";
import { m } from "../../../paraglide/messages";
import type { Project } from "../-types/project";
import ProjectMetaList from "./project-meta-list";

// タイトルの下に、メタ情報と概要文を並べるプロジェクト詳細ヘッダ。
const projectDetailHeaderStyles = sva({
    slots: ["root", "title", "detailGrid", "abstractBlock", "abstractTitle", "abstractText"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "8", lg: "10" },
            pb: { base: "8", lg: "10" },
            borderBottomWidth: "1px",
            borderColor: "fg",
        },
        title: {
            fontFamily: "heading",
            fontWeight: "600",
            fontSize: { base: "3rem", md: "4rem", lg: "4.5rem" },
            lineHeight: "0.95",
            letterSpacing: "-0.025em",
            color: "fg",
        },
        detailGrid: {
            display: "grid",
            gridTemplateColumns: { base: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
            columnGap: { lg: "16" },
            rowGap: { base: "8", lg: "0" },
            alignItems: "start",
        },
        abstractBlock: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
        },
        abstractTitle: {
            fontFamily: "heading",
            fontSize: "xl",
            fontWeight: "600",
            lineHeight: "1.3",
            color: "fg.subtle",
        },
        abstractText: {
            fontFamily: "body",
            fontWeight: "400",
            fontSize: { base: "1rem", lg: "1.125rem" },
            lineHeight: "1.65",
            color: "fg",
        },
    },
});

interface ProjectDetailHeaderProps {
    project: Project;
    /** ルートに追加で付与するクラス。コンテナ幅の調整などに使う。 */
    className?: string;
}

export default function ProjectDetailHeader({ project, className }: ProjectDetailHeaderProps) {
    const styles = projectDetailHeaderStyles();

    return (
        <header className={`${styles.root}${className ? ` ${className}` : ""}`}>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.detailGrid}>
                <ProjectMetaList items={project.metaItems} />
                <div className={styles.abstractBlock}>
                    <h2 className={styles.abstractTitle}>{m["projects.abstractTitle"]()}</h2>
                    <p className={styles.abstractText}>{project.abstract}</p>
                </div>
            </div>
        </header>
    );
}
