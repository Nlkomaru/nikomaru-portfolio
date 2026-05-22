import { sva } from "styled-system/css";
import { m } from "../../../../../paraglide/messages";

const projectsHeaderStyles = sva({
    slots: ["root", "title", "description"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
        },
        title: {
            color: "fg.subtle",
            fontFamily: "heading",
            fontSize: { base: "3xl", md: "4xl" },
            fontWeight: "semibold",
            letterSpacing: "-0.025em",
            lineHeight: "1.05",
        },
        description: {
            // maxW: "xl",
            fontSize: { base: "md", md: "lg" },
            lineHeight: "1.65",
        },
    },
});

export default function ProjectsHeader() {
    const styles = projectsHeaderStyles();

    return (
        <header className={styles.root}>
            <h1 className={styles.title}>{m["projects.archiveTitle"]()}</h1>
            <p className={styles.description}>{m["projects.archiveDescription"]()}</p>
        </header>
    );
}
