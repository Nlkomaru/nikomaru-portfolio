import { css } from "@/styled-system/css";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Works } from "~/lib/type";
import { Card } from "../ui/card";

// 文字列からハッシュを生成する関数
function generateHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash + char) * 31;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// ハッシュからHSLカラーを生成する関数
function hashToHSL(hash: number): string {
    const hue = hash % 360;
    const saturation = 60 + (hash % 20);
    const lightness = 75 + (hash % 10);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

type Params = {
    works: Works;
};

export default function WorksCard({ works }: Params) {
    // タイトルからグラデーションカラーを生成
    const gradientColors = useMemo(() => {
        const hash = generateHash(works.title);
        const color1 = hashToHSL(hash);
        const color2 = hashToHSL(generateHash(hash.toString()));
        return `linear-gradient(45deg, ${color1}, ${color2})`;
    }, [works.title]);

    const renderImage = () => {
        const aspectRatio = works.image
            ? works.image.width / works.image.height
            : "16/9";

        const imageStyle = css({
            aspectRatio: `${aspectRatio}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            height: "100%",
            objectFit: "cover",
            width: "100%",
            borderRadius: "xl",
            fontSize: "6xl",
            margin: "auto",
            textAlign: "center",
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
            },
        });

        if (!works.image) {
            return (
                <div
                    className={imageStyle}
                    style={{
                        backgroundImage: gradientColors,
                        width: "100%",
                        height: "100%",
                        aspectRatio: `${aspectRatio}`,
                    }}
                >
                    <div
                        className={css({
                            position: "relative",
                            zIndex: 2,
                            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            padding: "2rem",
                            alignContent: "center",
                            width: "100%",
                            height: "100%",
                        })}
                    >
                        {works.emoji}
                    </div>
                </div>
            );
        }
        return (
            <div className={imageStyle}>
                <Image
                    src={works.image.url}
                    alt={works.title}
                    placeholder={"blur"}
                    blurDataURL={works.image.url}
                    width={works.image.width}
                    height={works.image.height}
                    className={css({
                        borderRadius: "xl",
                    })}
                />
            </div>
        );
    };

    return (
        <Link
            href={`/works/${works.id}`}
            className={css({
                display: "block",
                width: "100%",
                textDecoration: "none",
            })}
        >
            <Card.Root
                className={css({
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    background: "none",
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                })}
            >
                <Card.Header
                    className={css({
                        padding: "0px",
                        margin: "auto",
                        justifyContent: "center",
                        position: "relative",
                        width: "100%",
                    })}
                >
                    {renderImage()}
                </Card.Header>

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
                                base: "xs",
                                lg: "md",
                            },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textAlign: "center",
                            width: "100%",
                            lineClamp: 1,
                        })}
                    >
                        {works.title}
                    </div>
                </Card.Body>
            </Card.Root>
        </Link>
    );
}
