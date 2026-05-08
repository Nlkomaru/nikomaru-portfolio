import { createFileRoute } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import ProjectDetailHeader from "../-components/project-detail-header";
import { parseProjectMarkdown } from "../-functions/parse-project-markdown";
import type { Project } from "../-types/project";
import SectionView from "./-components/section-view";
// `?raw` で markdown ファイルを文字列として取り込み、ビルド時にインライン化する。
import jaMarkdown from "./ja.md?raw";

// frontmatter の形は Project 型と同形にする。
const { frontmatter: project, sections } = parseProjectMarkdown<Project>(jaMarkdown);

const mineAuthPageStyles = sva({
    slots: [
        "root",
        "main",
        "topImage",
        "container",
        "sectionContainer",
        "section",
        "sectionWithImage",
        "sectionImage",
        "paragraph",
    ],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
            color: "fg.default",
        },
        main: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "8", md: "12" },
            px: { base: "4", md: "12" },
            py: { base: "12", md: "16" },
        },
        // ページ最上部のフルブリードのカバー画像
        topImage: {
            w: "full",
            h: { base: "16rem", md: "28rem" },
            objectFit: "cover",
        },
        // talks / photos と同じ最大幅 104rem の中央寄せコンテナ
        container: {
            w: "full",
            maxW: "104rem",
            mx: "auto",
        },
        sectionContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "16",
            width: "6xl",
            mx: "auto",
        },
        // セクションは grid で組む。モバイルは縦積み、デスクトップは2カラム。
        // 画像なしのときは1カラム（コンテナ幅いっぱい）にする。
        section: {
            display: "grid",
            gridTemplateColumns: "1fr",
            columnGap: "10",
            rowGap: { base: "6", lg: "0" },
            alignItems: "start",
        },
        sectionWithImage: {
            gridTemplateColumns: { base: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
        },
        sectionImage: {
            w: "full",
            h: "auto",
            objectFit: "cover",
            borderRadius: "md",
        },
        paragraph: {
            fontFamily: "body",
            mx: "auto",
            fontSize: "1rem",
            lineHeight: "1.75",
            color: "fg.default",
            maxW: "4xl",
        },
    },
});

export const Route = createFileRoute("/projects/MineAuth/")({
    component: MineAuthPage,
});

function MineAuthPage() {
    const styles = mineAuthPageStyles();

    return (
        <div className={styles.root}>
            <img src={project.coverImage.src} alt={project.coverImage.alt} className={styles.topImage} />

            <div className={styles.main}>
                <ProjectDetailHeader project={project} className={styles.container} />

                <div className={styles.sectionContainer}>
                    {sections.map((section) => (
                        <SectionView key={section.text.slice(0, 32)} section={section} styles={styles} />
                    ))}
                </div>
            </div>
        </div>
    );
}
