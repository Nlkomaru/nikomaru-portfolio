import { css } from "@/styled-system/css";
import parse from "html-react-parser";
import type { Works } from "~/lib/type";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

const headingRecipe = {
    base: {
        fontWeight: "bold",
    },
    variants: {
        size: {
            xl: {
                textStyle: "xl",
                mdDown: {
                    textStyle: "l",
                },
            },
            l: {
                textStyle: "l",
                mdDown: {
                    textStyle: "m",
                },
            },
            m: {
                textStyle: "m",
                mdDown: {
                    textStyle: "s",
                },
            },
        },
    },
};

export default async function Home({ params }: Params) {
    const resolvedParams = await params;
    const data: Works = await fetch(
        `https://nikomaru-portfolio-01.microcms.io/api/v1/products/${resolvedParams.id}`,
        {
            headers: {
                "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY as string,
            },
            cache: "no-cache",
            method: "GET",
        },
    ).then((res) => res.json());

    return (
        <div
            className={css({
                width: "100%",
                maxWidth: "1024px",
                margin: "0 auto",
                mb: "64px",
                "& .works-content": {
                    "& p": {
                        textStyle: "m",
                        mt: 3,
                        mb: 3,
                        whiteSpace: "pre-wrap",
                        mdDown: {
                            textStyle: "s",
                        },
                    },
                    "& ol": {
                        listStyleType: "decimal",
                        pl: "1.5rem",
                        my: 3,
                        "& li": {
                            textStyle: "m",
                            mdDown: {
                                textStyle: "s",
                            },
                        },
                    },
                    "& ul": {
                        listStyleType: "disc",
                        pl: "1.5rem",
                        my: 3,
                        "& li": {
                            textStyle: "m",
                            mdDown: {
                                textStyle: "s",
                            },
                        },
                    },
                    "& h1": {
                        ...headingRecipe.base,
                        ...headingRecipe.variants.size.xl,
                        mt: 0,
                        mb: 6,
                        mdDown: {
                            mb: 4,
                        },
                    },
                    "& h2": {
                        ...headingRecipe.base,
                        ...headingRecipe.variants.size.l,
                        mt: 6,
                        mb: 4,
                        mdDown: {
                            mt: 4,
                            mb: 3,
                        },
                    },
                    "& h3": {
                        ...headingRecipe.base,
                        ...headingRecipe.variants.size.m,
                        mt: 4,
                        mb: 3,
                        mdDown: {
                            mt: 3,
                            mb: 2,
                        },
                    },
                    "& a": {
                        color: "var(--colors-color-palette-default)",
                        textDecoration: "underline",
                        overflowWrap: "anywhere",
                        wordBreak: "break-all",
                    },
                    "& figure": {
                        width: "100%",
                        margin: "16px 0",
                    },
                    "& figure img": {
                        width: "100%",
                        boxShadow:
                            "inset 0px 2px 1px -1px rgba(255, 255, 255, 0.8)",
                        filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.05))",
                        borderRadius: "15px",
                    },
                },
                mdDown: {
                    overflow: "hidden",
                },
            })}
        >
            <div className="works-content">
                <h1>{data.title}</h1>
                {parse(data.description)}
            </div>
        </div>
    );
}
