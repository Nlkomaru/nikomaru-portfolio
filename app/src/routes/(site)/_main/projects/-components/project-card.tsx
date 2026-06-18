import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { sva } from "styled-system/css";
import { getBlurhashBackground } from "@/routes/-functions/blurhash-background";
import type { ProjectIndexItem } from "../-types/project";

type ProjectCardPlacement = "largeEnd" | "largeStart" | "small";

const projectCardStyles = sva({
    slots: ["root", "link", "image", "shade", "content", "category", "year", "name"],
    base: {
        root: {
            position: "relative",
            minH: "0",
            overflow: "hidden",
            borderRadius: "md",
        },
        link: {
            position: "absolute",
            inset: 0,
            display: "block",
            h: "full",
            w: "full",
            minH: "0",
            overflow: "hidden",
            borderRadius: "md",
            borderWidth: "1px",
            borderColor: "border.default",
            "& img": {
                transform: "scale(1.2)",
            },
            _hover: {
                "& img": {
                    transform: "scale(1.04)",
                },
                "& [data-project-shade]": {
                    opacity: 0.82,
                },
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "colorPalette.focusRing",
                outlineOffset: "3px",
            },
        },
        image: {
            position: "absolute",
            inset: "0",
            h: "full",
            w: "full",
            objectFit: "cover",
            transition: "transform 0.6s ease",
        },
        shade: {
            position: "absolute",
            inset: "0",
            opacity: 0.72,
            transition: "opacity 0.3s ease",
            bgGradient: "to-t",
            gradientFrom: "black/75",
            gradientVia: "black/15",
            gradientTo: "transparent",
        },
        content: {
            position: "absolute",
            insetInline: { base: "4", md: "6" },
            bottom: { base: "4", md: "6" },
            display: "flex",
            flexDirection: "column",
            gap: "2",
            color: "white",
        },
        category: {
            fontFamily: "mono",
            fontSize: "xs",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.82,
        },
        year: {
            fontFamily: "mono",
            fontSize: "2xs",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.72,
        },
        name: {
            fontFamily: "heading",
            fontWeight: "semibold",
            letterSpacing: "0",
            lineHeight: "1.05",
        },
    },
    variants: {
        placement: {
            largeStart: {
                root: {
                    aspectRatio: { base: "1 / 1", md: "auto" },
                    gridColumn: { base: "span 2", md: "1 / span 2" },
                    gridRow: { md: "1 / span 2" },
                },
                name: {
                    fontSize: { base: "3xl", md: "5xl" },
                },
            },
            largeEnd: {
                root: {
                    aspectRatio: { base: "1 / 1", md: "auto" },
                    gridColumn: { base: "span 2", md: "3 / span 2" },
                    gridRow: { md: "2 / span 2" },
                },
                name: {
                    fontSize: { base: "3xl", md: "5xl" },
                },
            },
            small: {
                root: {
                    aspectRatio: { base: "1 / 1", md: "auto" },
                },
                name: {
                    fontSize: { base: "lg", sm: "2xl", md: "3xl" },
                },
            },
        },
    },
});

const projectCardMotion = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.64, ease: "easeOut" },
    },
};

export default function ProjectCard({
    project,
    placement,
}: {
    project: ProjectIndexItem;
    placement: ProjectCardPlacement;
}) {
    const styles = projectCardStyles({ placement });

    return (
        <motion.div
            className={styles.root}
            variants={projectCardMotion}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
        >
            <Link to="/projects/$project" params={{ project: project.slug }} className={styles.link}>
                <img
                    src={project.image.src}
                    alt={project.image.alt}
                    decoding="async"
                    className={styles.image}
                    style={getBlurhashBackground(project.image.blurhash)}
                />
                <div className={styles.shade} data-project-shade="" />
                <div className={styles.content}>
                    {project.year ? <p className={styles.year}>{project.year}</p> : null}
                    <h2 className={styles.name}>{project.title}</h2>
                    <p className={styles.category}>{project.category}</p>
                </div>
            </Link>
        </motion.div>
    );
}
