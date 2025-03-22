"use client";
import { css } from "@/styled-system/css";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Works } from "~/lib/type";
import { Card } from "../../ui/card";

type Params = {
    works: Works;
};

export default function ImageCard({ works }: Params) {
    const { theme } = useTheme();
    const [clientTheme, setClientTheme] = useState<string | undefined>(
        undefined,
    );

    useEffect(() => {
        setClientTheme(theme);
    }, [theme]);

    return (
        <Link
            href={`/works/${works.id}`}
            className={css({
                display: "block",
                width: "100%",
            })}
        >
            <Card.Root
                className={css({
                    width: "100%",
                    outline: "1px solid",
                    outlineColor: "gray.light.a5",
                    display: "grid",
                    gridTemplateColumns: "1fr",
                })}
            >
                <Card.Header
                    className={css({
                        padding: "0px",
                        outline: "1px solid",
                        outlineColor: "black",
                    })}
                >
                    <div
                        className={css({
                            width: "100%",
                            aspectRatio: "16/9",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            overflow: "hidden",
                        })}
                    >
                        <Image
                            src={works.image?.url}
                            alt={works.title}
                            placeholder={"blur"}
                            blurDataURL={works.image?.url}
                            fill
                            className={css({
                                objectFit: "cover",
                                filter:
                                    clientTheme === "dark"
                                        ? "brightness(0.8)"
                                        : "brightness(1)",
                            })}
                        />
                    </div>
                </Card.Header>
                <hr
                    style={{
                        color: "gray",
                        height: 2,
                    }}
                />
                <Card.Body
                    className={css({
                        padding: {
                            base: "4px 8px 0px 8px",
                            lg: "8px 16px",
                        },
                    })}
                >
                    <div
                        className={css({
                            fontSize: {
                                base: "sm",
                                lg: "lg",
                            },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            lineClamp: 1,
                        })}
                    >
                        {works.title}
                    </div>
                </Card.Body>

                <Card.Footer
                    className={css({
                        padding: {
                            base: "4px 8px",
                            lg: "8px 16px",
                        },
                        fontSize: {
                            base: "xs",
                            lg: "md",
                        },
                    })}
                >
                    最終更新日:{" "}
                    {works.updatedAt
                        ? new Date(works.updatedAt).toISOString().split("T")[0]
                        : "N/A"}
                </Card.Footer>
            </Card.Root>
        </Link>
    );
}
