import { sva } from "styled-system/css";
import type { ProjectIndexItem } from "../-types/project";
import ProjectCard from "./project-card";

const projectCountPerPattern = 3;

interface ProjectChunk {
    layout: "largeEnd" | "largeStart";
    projects: ProjectIndexItem[];
}

const projectGalleryStyles = sva({
    slots: ["root", "pattern"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "4", md: "6" },
        },
        pattern: {
            display: "grid",
            gap: { base: "4", md: "6" },
            gridTemplateColumns: { base: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gridTemplateRows: { md: "repeat(2, minmax(0, 1fr))" },
            aspectRatio: { md: "3 / 2" },
            gridAutoFlow: { md: "dense" },
        },
    },
});

export default function ProjectGallery({ projects }: { projects: readonly ProjectIndexItem[] }) {
    return (
        <div className={projectGalleryStyles().root}>
            {chunkProjects(projects).map((projectChunk) => {
                const styles = projectGalleryStyles();

                return (
                    <div className={styles.pattern} key={getProjectChunkKey(projectChunk.projects)}>
                        {projectChunk.projects.map((project, index) => (
                            <ProjectCard
                                key={project.slug}
                                project={project}
                                placement={getProjectCardPlacement(projectChunk, index)}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

function chunkProjects(projects: readonly ProjectIndexItem[]): ProjectChunk[] {
    const chunks: ProjectChunk[] = [];

    for (let index = 0; index < projects.length; index += projectCountPerPattern) {
        const chunkOrder = index / projectCountPerPattern;
        chunks.push({
            layout: chunkOrder % 2 === 0 ? "largeStart" : "largeEnd",
            projects: projects.slice(index, index + projectCountPerPattern),
        });
    }

    return chunks;
}

function getProjectCardPlacement(projectChunk: ProjectChunk, index: number): "largeEnd" | "largeStart" | "small" {
    if (projectChunk.projects.length < projectCountPerPattern) {
        return index === 0 ? "largeStart" : "small";
    }
    if (projectChunk.layout === "largeStart") {
        return index === 0 ? "largeStart" : "small";
    }
    return index === projectCountPerPattern - 1 ? "largeEnd" : "small";
}

function getProjectChunkKey(projects: readonly ProjectIndexItem[]): string {
    return projects.map((project) => project.slug).join("-");
}
