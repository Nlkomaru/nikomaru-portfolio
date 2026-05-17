import { createFileRoute, notFound } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { getLocale } from "../../../../../paraglide/runtime";
import ProjectDetailHeader from "../-components/project-detail-header";
import ProjectSection from "../-components/project-section";
import { getProjectMarkdown, isProjectSlug } from "../-functions/get-project-markdown";
import { parseProjectMarkdown } from "../-functions/parse-project-markdown";
import type { Project } from "../-types/project";

const projectDetailPageStyles = sva({
    slots: ["root", "main", "topImage", "contentContainer", "sectionContainer"],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
            color: "fg",
        },
        main: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "8", md: "12" },
            px: { base: "4", md: "12" },
            py: { base: "12", md: "16" },
            maxW: "7xl",
            mx: "auto",
        },
        topImage: {
            w: "full",
            h: { base: "16rem", md: "28rem" },
            objectFit: "cover",
        },
        contentContainer: {
            w: "full",
            mx: "auto",
        },
        sectionContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "12",
        },
    },
});

export const Route = createFileRoute("/(site)/_main/projects/$project/")({
    loader: ({ params }) => {
        if (!isProjectSlug(params.project)) {
            throw notFound();
        }

        return { slug: params.project };
    },
    head: ({ loaderData }) => {
        if (!loaderData) {
            return {};
        }

        const { frontmatter: project } = getLocalizedProject(loaderData.slug);

        return {
            meta: [
                {
                    title: `${project.openGraph.title} - Project | Nikomaru Portfolio`,
                },
                {
                    name: "description",
                    content: project.openGraph.description,
                },
                {
                    property: "og:type",
                    content: "article",
                },
                {
                    property: "og:title",
                    content: project.openGraph.title,
                },
                {
                    property: "og:description",
                    content: project.openGraph.description,
                },
                {
                    property: "og:image",
                    content: project.openGraph.image,
                },
                {
                    property: "og:image:alt",
                    content: project.openGraph.imageAlt,
                },
                {
                    name: "twitter:card",
                    content: "summary_large_image",
                },
                {
                    name: "twitter:title",
                    content: project.openGraph.title,
                },
                {
                    name: "twitter:description",
                    content: project.openGraph.description,
                },
                {
                    name: "twitter:image",
                    content: project.openGraph.image,
                },
            ],
        };
    },
    component: ProjectDetailPage,
});

function ProjectDetailPage() {
    const { slug } = Route.useLoaderData();
    const { frontmatter: project, sections } = getLocalizedProject(slug);
    const styles = projectDetailPageStyles();
    const sectionContainerClassName = `${styles.contentContainer} ${styles.sectionContainer}`;
    let imageNumber = 0;

    return (
        <div className={styles.root}>
            <img src={project.coverImage.src} alt={project.coverImage.alt} className={styles.topImage} />

            <div className={styles.main}>
                <ProjectDetailHeader project={project} className={styles.contentContainer} />

                <div className={sectionContainerClassName}>
                    {sections.map((section) => {
                        const currentImageNumber = section.image ? ++imageNumber : undefined;

                        return (
                            <ProjectSection
                                key={section.text.slice(0, 48)}
                                section={section}
                                imageNumber={currentImageNumber}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Markdown は locale ごとに別ファイルなので、描画時点の locale から毎回選び直す。
function getLocalizedProject(slug: Parameters<typeof getProjectMarkdown>[0]) {
    return parseProjectMarkdown<Project>(getProjectMarkdown(slug, getLocale()));
}
