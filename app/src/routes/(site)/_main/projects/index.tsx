import { createFileRoute } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { m } from "../../../../paraglide/messages";
import ProjectGallery from "./-components/project-gallery";
import ProjectsHeader from "./-components/projects-header";
import chlorophyllImageSrc from "./-content/Chlorophyll/assets/chlorophyll.avif?url";
import mineAuthImageSrc from "./-content/MineAuth/assets/community.png?url";
import mineStampImageSrc from "./-content/MineStamp/assets/player-with-emoji.avif?url";
import moriPathImageSrc from "./-content/MoriPath/assets/app-showcase.png?url";
import moripaFishingImageSrc from "./-content/MoripaFishing/assets/cover.jpg?url";
import raceAssistImageSrc from "./-content/RaceAssist/assets/race-place.avif?url";
import type { ProjectIndexItem } from "./-types/project";

const projects = [
    {
        slug: "MineAuth",
        title: "MineAuth",
        category: "Authorize Systems",
        year: "2024 — Present",
        image: {
            src: mineAuthImageSrc,
            alt: "MineAuth Community",
            blurhash: "UVF#HaIt9coe~9M}IWWW--V[RkR+%KjIV]Wo",
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
            blurhash: "UCQANz5PxY?bW+xaIpODWF~W?b-;?u%29Y%N",
        },
    },
    {
        slug: "RaceAssist",
        title: "RaceAssist",
        category: "Minecraft Plugin",
        year: "2021 — 2024",
        image: {
            src: raceAssistImageSrc,
            alt: "RaceAssist のコース管理を想起させるキービジュアル",
            blurhash: "UYG]ds${%Nx^p3xcxss+Imt5RPMxoNjJt7t7",
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
            blurhash: "UIKLpv?v4-00tlNF?IkV00xuiwD%~Xxa00In",
        },
    },

    {
        slug: "MineStamp",
        title: "MineStamp",
        category: "Minecraft Plugin",
        year: "2023 — 2024",
        image: {
            src: mineStampImageSrc,
            alt: "MineStamp の絵文字表示を想起させるキービジュアル",
            blurhash: "ULDvvLx{E1MwS,S*o#M^%jbeM_ocXBo2oHoc",
        },
    },
    {
        slug: "MoripaFishing",
        title: "MoripaFishing",
        category: "Minecraft Plugin",
        year: "2025 — Present",
        image: {
            src: moripaFishingImageSrc,
            alt: "MoripaFishing の機能を想起させるキービジュアル",
            blurhash: "UKC%.[PfDgInIzq|Vqr=lotQR2NF?cM{sjbt",
        },
    },
] satisfies ProjectIndexItem[];

const projectsPageStyles = sva({
    slots: ["root", "container"],
    base: {
        root: {
            w: "full",
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            bg: "bg.canvas",
        },
        container: {
            px: { base: "4", md: "12" },
            py: { base: "12", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: { base: "14", md: "20" },
        },
    },
});

export const Route = createFileRoute("/(site)/_main/projects/")({
    head: () => ({
        meta: [
            {
                title: `${m["projects.archiveTitle"]()} | Nikomaru Portfolio`,
            },
            {
                name: "description",
                content: m["projects.archiveDescription"](),
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
