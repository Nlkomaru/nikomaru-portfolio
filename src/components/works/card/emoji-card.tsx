"use client";
import { css } from "@/styled-system/css";
import Link from "next/link";
import { useMemo } from "react";
import type { Works } from "~/lib/type";
import { Card } from "../../ui/card";

type Params = {
    works: Works;
};

// 文字列からハッシュを生成する関数
function generateHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash + char) * 31; // 31を掛けることでより大きな数値の変化を生む
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// ハッシュからHSLカラーを生成する関数
function hashToHSL(hash: number): string {
    // ハッシュを0-360の範囲に変換
    const hue = hash % 360;
    // 彩度と明度をハッシュから生成して変化をつける
    const saturation = 60 + (hash % 20); // 60-80%の範囲
    const lightness = 75 + (hash % 10); // 75-85%の範囲
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function EmojiCard({ works }: Params) {
    // タイトルからグラデーションカラーを生成
    const gradientColors = useMemo(() => {
        const hash = generateHash(works.title);
        const color1 = hashToHSL(hash);
        const color2 = hashToHSL(generateHash(hash.toString()));
        return `linear-gradient(45deg, ${color1}, ${color2})`;
    }, [works.title]);

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
                            fontSize: "6xl",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                    "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
                                zIndex: 1,
                            },
                        })}
                        style={{
                            backgroundImage: gradientColors,
                        }}
                    >
                        <div
                            className={css({
                                position: "relative",
                                zIndex: 2,
                                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            })}
                        >
                            {works.emoji}
                        </div>
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
