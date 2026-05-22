import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sva } from "styled-system/css";
import ProjectImagePreview from "./project-image-preview";

const projectMarkdownStyles = sva({
    slots: [
        "root",
        "heading2",
        "heading3",
        "heading4",
        "paragraph",
        "link",
        "list",
        "orderedList",
        "listItem",
        "blockquote",
        "horizontalRule",
        "tableWrapper",
        "table",
        "tableHead",
        "tableCell",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            fontFamily: "body",
            fontSize: "1rem",
            lineHeight: "tall",
        },
        heading2: {
            fontFamily: "heading",
            pb: "2",
            fontSize: { base: "1.5rem", md: "1.875rem" },
            fontWeight: "600",
            lineHeight: "1.25",
            color: "fg.subtle",
        },
        heading3: {
            fontFamily: "heading",
            pb: "2",
            fontSize: { base: "1.25rem", md: "1.5rem" },
            fontWeight: "600",
            lineHeight: "1.3",
            color: "fg.subtle",
        },
        heading4: {
            fontFamily: "heading",
            fontSize: "1.125rem",
            fontWeight: "600",
            lineHeight: "1.4",
            color: "fg.subtle",
        },
        paragraph: {
            // textIndent: "1em",
        },
        link: {
            color: "fg.subtle",
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationThickness: "2px",
            textUnderlineOffset: "2px",
            textDecorationColor: "border.outline",
            transition: "color 0.2s ease, text-decoration-color 0.2s ease",
            _hover: {
                color: "fg.subtle",
                textDecorationColor: "colorPalette.border",
            },
        },
        list: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            pl: "6",
            listStyleType: "disc",
        },
        orderedList: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            pl: "6",
            listStyleType: "decimal",
        },
        listItem: {
            pl: "1",
        },
        blockquote: {
            borderLeftWidth: "3px",
            borderColor: "border.default",
            pl: "5",
            color: "fg.muted",
        },
        horizontalRule: {
            my: "4",
            borderColor: "border.default",
        },
        tableWrapper: {
            overflowX: "auto",
        },
        table: {
            w: "full",
            borderCollapse: "collapse",
            fontSize: "0.9375rem",
        },
        tableHead: {
            fontWeight: "600",
            bg: "bg.subtle",
        },
        tableCell: {
            borderWidth: "1px",
            borderColor: "border.default",
            px: "4",
            py: "3",
            textAlign: "left",
        },
    },
});

type ProjectMarkdownProps = {
    markdown: string;
    /** `root` スロットに追加するクラス（概要ブロックなど別タイポにしたいとき）。 */
    className?: string;
};

export default function ProjectMarkdown({ markdown, className }: ProjectMarkdownProps) {
    const styles = projectMarkdownStyles();
    const rootClassName = className ? `${styles.root} ${className}` : styles.root;

    return (
        <div className={rootClassName}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
                    h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
                    h4: ({ children }) => <h4 className={styles.heading4}>{children}</h4>,
                    p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className={styles.link}
                            target={href?.startsWith("http") ? "_blank" : undefined}
                            rel={href?.startsWith("http") ? "noreferrer" : undefined}
                        >
                            {children}
                        </a>
                    ),
                    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                    ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
                    li: ({ children }) => <li className={styles.listItem}>{children}</li>,
                    img: ({ alt, src }) => <ProjectImagePreview src={src} alt={alt ?? ""} />,
                    blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
                    hr: () => <hr className={styles.horizontalRule} />,
                    table: ({ children }) => (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>{children}</table>
                        </div>
                    ),
                    th: ({ children }) => <th className={`${styles.tableHead} ${styles.tableCell}`}>{children}</th>,
                    td: ({ children }) => <td className={styles.tableCell}>{children}</td>,
                }}
            >
                {markdown}
            </Markdown>
        </div>
    );
}
