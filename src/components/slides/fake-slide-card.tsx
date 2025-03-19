import { css } from "@/styled-system/css";
import { Skeleton } from "~/components/ui/skeleton";
import { Card } from "../ui/card";

export default function FakeSlideCard() {
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
                    {renderImage()}
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
                        <Skeleton>
                            <div>Title placeholder</div>
                        </Skeleton>
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
                    <Skeleton>
                        <div>最終更新日: YYYY-MM-DD</div>
                    </Skeleton>
                </Card.Footer>
            </Card.Root>
        </div>
    );
}
