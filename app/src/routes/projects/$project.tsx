import { createFileRoute, Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";

const projectPageStyles = sva({
    slots: ["root", "section", "eyebrow", "title", "description", "backLink"],
    base: {
        root: {
            minH: "100vh",
            bg: "bg.canvas",
            color: "fg.default",
            pt: { base: "20", md: "16" },
            px: { base: "8", md: "20" },
        },
        section: {
            maxW: "3xl",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "6",
        },
        eyebrow: {
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.45em",
            color: "fg.muted",
            fontFamily: '"Space Mono", monospace',
        },
        title: {
            fontSize: { base: "2.5rem", md: "4.5rem" },
            lineHeight: 1,
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
        },
        description: {
            maxW: "lg",
            fontSize: "0.75rem",
            lineHeight: "8",
            color: "fg.subtle",
            fontFamily: '"Space Mono", monospace',
        },
        backLink: {
            display: "inline-flex",
            alignItems: "center",
            gap: "3",
            borderWidth: "1px",
            borderColor: "border.default",
            bg: "bg.default",
            px: "5",
            py: "3",
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "fg.default",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
            _hover: {
                bg: "bg.subtle",
                borderColor: "border.outline",
            },
        },
    },
});

export const Route = createFileRoute("/projects/$project")({
    component: ProjectPage,
});

function ProjectPage() {
    const { project } = Route.useParams();
    const styles = projectPageStyles();

    return (
        <main className={styles.root}>
            <section className={styles.section}>
                <p className={styles.eyebrow}>Project</p>
                <h1 className={styles.title}>{project}</h1>
                <p className={styles.description}>
                    This page is a placeholder for now. Add screenshots, links, and a write-up for {project}.
                </p>
                <Link to="/projects" className={styles.backLink}>
                    Back to Projects
                </Link>
            </section>
        </main>
    );
}
