import { css } from "@/styled-system/css";
import Image from "next/image";
import Link from "next/link";
import type { Works } from "~/lib/type";
import { Card } from "../ui/card";
type Params = {
    works: Works;
};

export default function WorksCard({ works }: Params) {
    const renderImage = () => {
        const aspectRatio = works.image
            ? works.image.width / works.image.height
            : 1;

        const imageStyle = css({
            aspectRatio: `${aspectRatio}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            height: {
                base: "200px",
                xl: "280px",
            },
            borderRadius: "xl",
            fontSize: "6xl",
            margin: "auto",
            textAlign: "center",
        });

        if (!works.image) {
            return <div className={imageStyle}>{works.emoji}</div>;
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
                        outline: "none",
                        margin: "auto",
                        justifyContent: "center",
                        position: "relative",
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
