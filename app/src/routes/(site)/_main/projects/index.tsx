import { createFileRoute } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import ProjectGallery from "./-components/project-gallery";
import ProjectsHeader from "./-components/projects-header";
import chlorophyllImageSrc from "./-content/Chlorophyll/assets/chlorophyll.avif?url";
import mineAuthImageSrc from "./-content/MineAuth/assets/community.png?url";
import moriPathImageSrc from "./-content/MoriPath/assets/app-showcase.png?url";
import type { ProjectIndexItem } from "./-types/project";

const projects = [
    {
        slug: "MineAuth",
        title: "MineAuth",
        category: "Minecraft Plugin ・ Authorize",
        year: "2024 — Present",
        image: {
            src: mineAuthImageSrc,
            alt: "MineAuth Community",
        },
    },
    {
        slug: "Chlorophyll",
        title: "Chlorophyll",
        category: "Design System",
        year: "2025 — Present",
        image: {
            src: chlorophyllImageSrc,
            alt: "Chlorophyll のテーマを想起させるキービジュアル",
        },
    },
    {
        slug: "MoriPath",
        title: "MoriPath",
        category: "Web App",
        year: "2025 — Present",
        image: {
            src: moriPathImageSrc,
            alt: "MoriPath の画面デザイン",
        },
    },
    {
        slug: "MineAuth1",
        title: "MineAuth",
        category: "Minecraft Plugin ・ Authorize",
        year: "2024 — Present",
        image: {
            src: mineAuthImageSrc,
            alt: "MineAuth Community",
        },
    },
    {
        slug: "Chlorophyll1",
        title: "Chlorophyll",
        category: "Design System",
        year: "2025 — Present",
        image: {
            src: chlorophyllImageSrc,
            alt: "Chlorophyll のテーマを想起させるキービジュアル",
        },
    },
    {
        slug: "MoriPath1",
        title: "MoriPath",
        category: "Web App",
        year: "2025 — Present",
        image: {
            src: moriPathImageSrc,
            alt: "MoriPath の画面デザイン",
        },
    },
    {
        slug: "MineAuth2",
        title: "MineAuth",
        category: "Minecraft Plugin ・ Authorize",
        year: "2024 — Present",
        image: {
            src: mineAuthImageSrc,
            alt: "MineAuth Community",
        },
    },
    {
        slug: "Chlorophyll2",
        title: "Chlorophyll",
        category: "Design System",
        year: "2025 — Present",
        image: {
            src: chlorophyllImageSrc,
            alt: "Chlorophyll のテーマを想起させるキービジュアル",
        },
    },
    {
        slug: "MoriPath2",
        title: "MoriPath",
        category: "Web App",
        year: "2025 — Present",
        image: {
            src: moriPathImageSrc,
            alt: "MoriPath の画面デザイン",
        },
    },
] satisfies ProjectIndexItem[];

const projectsPageStyles = sva({
    slots: ["root", "container"],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
        },
        container: {
            maxW: "104rem",
            mx: "auto",
            px: { base: "4", md: "12" },
            py: { base: "6", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: { base: "8", md: "12" },
        },
    },
});

export const Route = createFileRoute("/(site)/_main/projects/")({
    head: () => ({
        meta: [
            {
                title: "Projects | Nikomaru Portfolio",
            },
            {
                name: "description",
                content: "Nikomaru portfolio projects.",
            },
        ],
    }),
    component: ProjectsPage,
});

function ProjectsPage() {
    const styles = projectsPageStyles();

    return (
        <main className={styles.root}>
            <section className={styles.container}>
                <ProjectsHeader />
                <ProjectGallery projects={projects} />
            </section>
        </main>
    );
}
