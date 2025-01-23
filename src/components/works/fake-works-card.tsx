import { css } from "@/styled-system/css";
import { Skeleton } from "~/components/ui/skeleton";
import { Card } from "../ui/card";

export default function FakeWorksCard() {
    const renderImage = () => {
        const imageStyle = css({
            aspectRatio: "16 / 9",
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
            textAlign: "center",
        });

        return (
            <Skeleton className={imageStyle}>
                <div className={imageStyle} />
            </Skeleton>
        );
    };

    return (
        <div
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
                        <Skeleton>
                            <div>Title placeholder</div>
                        </Skeleton>
                    </div>
                </Card.Body>
            </Card.Root>
        </div>
    );
}
