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
        position: "relative",
        fontWeight: "bold",
        background:
            "linear-gradient(90deg, var(--colors-color-palette-2) 0%, var(--colors-color-palette-7) 100%)",
        zIndex: 0,
    },
    variants: {
        size: {
            xl: {
                padding: "16px 0",
                position: "relative",
                left: {
                    base: "8px",
                    md: "-24px",
                },
                paddingLeft: "24px",
                paddingRight: "40px",
                borderRadius: "0 20px 20px 0",
                background:
                    "linear-gradient(90deg, var(--colors-color-palette-2) 0%, var(--colors-color-palette-7) 100%)",
                width: {
                    base: "calc(100% - 8px)",
                    md: "calc(100% + 48px)",
                },
                textStyle: "xl",
                mdDown: {
                    textStyle: "l",
                },
                "&:before": {
                    content: '""',
                    height: "100%",
                    width: "8px",
                    backgroundColor: "var(--colors-color-palette-default)",
                    borderRadius: "8px 0px 0px 8px",
                    position: "absolute",
                    left: "-8px",
                    top: "0",
                    zIndex: 1,
                },
                "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    borderRadius: "8px 40px 40px 8px",
                    left: "-24px",
                    top: "0px",
                },
            },
            l: {
                padding: "12px 0",
                position: "relative",
                left: {
                    base: "6px",
                    md: "-26px",
                },
                paddingLeft: "26px",
                paddingRight: "30px",
                borderRadius: "0 15px 15px 0",
                background:
                    "linear-gradient(90deg, var(--colors-color-palette-2) 0%, var(--colors-color-palette-6) 100%)",
                width: {
                    base: "calc(100% - 6px)",
                    md: "calc(100% + 36px)",
                },
                textStyle: "l",
                mdDown: {
                    textStyle: "m",
                },
                "&:before": {
                    content: '""',
                    height: "100%",
                    width: "8px",
                    backgroundColor: "var(--colors-color-palette-default)",
                    borderRadius: "8px 0px 0px 8px",
                    position: "absolute",
                    left: "-8px",
                    top: "0",
                    zIndex: 1,
                },
                "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    borderRadius: "6px 30px 30px 6px",
                    left: "-20px",
                    top: "0px",
                },
            },
            m: {
                padding: "8px 0",
                position: "relative",
                left: {
                    base: "4px",
                    md: "-28px",
                },
                paddingLeft: "28px",
                paddingRight: "24px",
                borderRadius: "0 12px 12px 0",
                background:
                    "linear-gradient(90deg, var(--colors-color-palette-2) 0%, var(--colors-color-palette-5) 100%)",
                width: {
                    base: "calc(100% - 4px)",
                    md: "calc(100% + 28px)",
                },
                textStyle: "m",
                mdDown: {
                    textStyle: "s",
                },
                "&:before": {
                    content: '""',
                    height: "100%",
                    width: "8px",
                    backgroundColor: "var(--colors-color-palette-default)",
                    borderRadius: "8px 0px 0px 8px",
                    position: "absolute",
                    left: "-8px",
                    top: "0",
                    zIndex: 1,
                },
                "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    borderRadius: "4px 24px 24px 4px",
                    left: "-16px",
                    top: "0px",
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
                maxWidth: "800px",
                margin: "auto",
            })}
        >
            <div
                className={css({
                    width: "100%",
                    maxWidth: "800px",
                    margin: "0 auto",
                    mb: "120px",
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
                            mb: 8,
                        },
                        "& h2": {
                            ...headingRecipe.base,
                            ...headingRecipe.variants.size.l,
                            mt: 10,
                            mb: 6,
                        },
                        "& h3": {
                            ...headingRecipe.base,
                            ...headingRecipe.variants.size.m,
                            mt: 8,
                            mb: 4,
                        },
                        "& a": {
                            color: "var(--colors-color-palette-default)",
                            textDecoration: "underline",
                            overflowWrap: "anywhere",
                            wordBreak: "break-all",
                        },
                        "& figure": {
                            width: "100%",
                            margin: "20px 0",
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
        </div>
    );
}
