import { sva } from "styled-system/css";
import type { Project } from "../-types/project";
import ProjectMetaList from "./project-meta-list";

// プロジェクト詳細ページの2カラムヘッダ。
// 左カラム: 「Project / 002」 + タイトル + Definition List
// 右カラム: 「— Abstract」 + 説明文
const projectDetailHeaderStyles = sva({
    slots: ["root", "primaryColumn", "secondaryColumn", "eyebrow", "title", "abstractLabel", "abstractText"],
    base: {
        root: {
            // 黒の太いラインで区切る、Figmaの「Header」コンテナを再現する
            display: "grid",
            gridTemplateColumns: { base: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
            columnGap: { lg: "16" },
            rowGap: { base: "10", lg: "0" },
            pb: { base: "8", lg: "10" },
            borderBottomWidth: "1px",
            borderColor: "fg.default",
        },
        primaryColumn: {
            display: "flex",
            flexDirection: "column",
            gap: "6",
        },
        secondaryColumn: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            // デスクトップでは Abstract をやや下に下げて視覚的なリズムを作る
            pt: { base: "0", lg: "16" },
        },
        eyebrow: {
            fontFamily: "mono",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "fg.muted",
        },
        title: {
            fontFamily: "heading",
            fontWeight: "600",
            py: { base: "0", lg: "4" },
            // Figmaでは 72px / line-height 0.95 / tracking -0.025em
            fontSize: { base: "3rem", md: "4rem", lg: "4.5rem" },
            lineHeight: "0.95",
            letterSpacing: "-0.025em",
            color: "fg.default",
        },
        abstractLabel: {
            fontFamily: "mono",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "fg.muted",
        },
        abstractText: {
            fontFamily: "body",
            fontWeight: "400",
            fontSize: { base: "1rem", lg: "1.125rem" },
            lineHeight: "1.65",
            color: "fg.default",
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
            <div className={styles.primaryColumn}>
                <h1 className={styles.title}>{project.title}</h1>

                <ProjectMetaList items={project.metaItems} />
            </div>

            <div className={styles.secondaryColumn}>
                <p className={styles.abstractLabel}>— Abstract</p>
                <p className={styles.abstractText}>{project.abstract}</p>
            </div>
        </header>
    );
}
