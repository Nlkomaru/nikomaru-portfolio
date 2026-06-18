import { motion } from "motion/react";
import { sva } from "styled-system/css";
import type { ProjectIndexItem } from "../-types/project";
import ProjectCard from "./project-card";

const projectCountPerPattern = 6;

interface ProjectChunk {
    density: "compact" | "mosaic";
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
            gap: { base: "4", md: "4" },
            gridTemplateColumns: { base: "repeat(2, minmax(0, 1fr))" },
            gridAutoFlow: { md: "dense" },
        },
    },
    variants: {
        density: {
            compact: {
                pattern: {
                    gridTemplateColumns: { md: "repeat(3, minmax(0, 1fr))" },
                    gridTemplateRows: { md: "repeat(2, minmax(0, 1fr))" },
                    aspectRatio: { md: "3 / 2" },
                },
            },
            mosaic: {
                pattern: {
                    gridTemplateColumns: { md: "repeat(4, minmax(0, 1fr))" },
                    gridTemplateRows: { md: "repeat(3, minmax(0, 1fr))" },
                    aspectRatio: { md: "4 / 3" },
                },
            },
        },
    },
});

const projectPatternMotion = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.11,
        },
    },
};

export default function ProjectGallery({ projects }: { projects: readonly ProjectIndexItem[] }) {
    return (
        <div className={projectGalleryStyles().root}>
            {chunkProjects(projects).map((projectChunk) => {
                const styles = projectGalleryStyles({ density: projectChunk.density });

                return (
                    <motion.div
                        className={styles.pattern}
                        key={getProjectChunkKey(projectChunk.projects)}
                        variants={projectPatternMotion}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-10% 0px" }}
                    >
                        {projectChunk.projects.map((project, index) => (
                            <ProjectCard
                                key={project.slug}
                                project={project}
                                placement={getProjectCardPlacement(projectChunk, index)}
                            />
                        ))}
                    </motion.div>
                );
            })}
        </div>
    );
}

function chunkProjects(projects: readonly ProjectIndexItem[]): ProjectChunk[] {
    const chunks: ProjectChunk[] = [];

    for (let index = 0; index < projects.length; index += projectCountPerPattern) {
        const projectChunk = projects.slice(index, index + projectCountPerPattern);
        chunks.push({
            density: projectChunk.length >= 4 ? "mosaic" : "compact",
            projects: projectChunk,
        });
    }

    return chunks;
}

function getProjectCardPlacement(projectChunk: ProjectChunk, index: number): "largeEnd" | "largeStart" | "small" {
    if (index === 0) {
        return "largeStart";
    }
    if (projectChunk.density === "mosaic" && index === 3) {
        return "largeEnd";
    }
    if (projectChunk.density === "compact") {
        return index === 0 ? "largeStart" : "small";
    }
    return "small";
}

function getProjectChunkKey(projects: readonly ProjectIndexItem[]): string {
    return projects.map((project) => project.slug).join("-");
}
