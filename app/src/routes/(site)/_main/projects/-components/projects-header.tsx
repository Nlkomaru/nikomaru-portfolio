import { sva } from "styled-system/css";

const projectsHeaderStyles = sva({
    slots: ["root", "title"],
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
            letterSpacing: "0",
            lineHeight: "1.05",
        },
    },
});

export default function ProjectsHeader() {
    const styles = projectsHeaderStyles();

    return (
        <header className={styles.root}>
            <h1 className={styles.title}>Projects</h1>
        </header>
    );
}
