import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sva } from "styled-system/css";

// もりのパーティのリンクは、ブランドカラーとロゴアイコンを付けて特別扱いする。
const MORINO_PARTY_URL = "https://morino.party";

const aboutMarkdownStyles = sva({
    slots: ["root", "paragraph", "link", "brandLink", "brandIcon", "brandText"],
    base: {
        // ラッパー自体は表示に影響させず、段落を親要素（float 周りや flex 列）へそのまま流す。
        root: {
            display: "contents",
        },
        paragraph: {
            color: "fg",
            fontSize: { base: "sm", md: "md" },
            lineHeight: { base: "1.85", md: "1.9" },
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
        // もりのパーティ専用リンク。本文は通常のインラインフローのまま、ブランドカラーを当てる。
        brandLink: {
            color: "#00805c",
            fontWeight: "medium",
            transition: "opacity 0.2s ease",
            _hover: {
                opacity: 0.8,
            },
        },
        // アイコンはインライン要素として本文の中に並べ、ベースラインに揃えて配置する。
        brandIcon: {
            display: "inline-block",
            height: "1.1em",
            width: "auto",
            mr: "1",
            verticalAlign: "-0.2em",
        },
        // 下線はテキスト部分にだけ付け、ロゴには掛けない。
        brandText: {
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationThickness: "2px",
            textUnderlineOffset: "2px",
            textDecorationColor: "#00805c",
        },
    },
});

interface AboutMarkdownProps {
    /** 描画する Markdown 本文。 */
    markdown: string;
}

// about ページの本文（自己紹介・趣味・今後）を Markdown として描画する。
export default function AboutMarkdown({ markdown }: AboutMarkdownProps) {
    const styles = aboutMarkdownStyles();

    return (
        <div className={styles.root}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                    a: ({ children, href }) => {
                        const isExternal = href?.startsWith("http");
                        const externalProps = isExternal ? ({ target: "_blank", rel: "noreferrer" } as const) : {};

                        // もりのパーティへのリンクは、ロゴ付きのブランドリンクとして描画する。
                        if (href === MORINO_PARTY_URL) {
                            return (
                                <a href={href} className={styles.brandLink} {...externalProps}>
                                    <img
                                        className={styles.brandIcon}
                                        src="/assets/moripa.svg"
                                        alt=""
                                        aria-hidden="true"
                                    />
                                    <span className={styles.brandText}>{children}</span>
                                </a>
                            );
                        }

                        return (
                            <a href={href} className={styles.link} {...externalProps}>
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {markdown}
            </Markdown>
        </div>
    );
}
