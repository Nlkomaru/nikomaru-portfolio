import { css } from "styled-system/css";
import { Card } from "../../../components/ui";
import type { Slide } from "../-types/slide";

interface SlideCardProps {
    slide: Slide;
    priority?: boolean;
}

export default function SlideCard({ slide, priority = false }: SlideCardProps) {
    return (
        <a href={slide.link} target="_blank" rel="noopener noreferrer" className={css({ display: "block", w: "full" })}>
            <Card.Root
                variant="outline"
                className={css({
                    w: "full",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s ease",
                    _hover: {
                        boxShadow: "md",
                    },
                })}
            >
                <div className={css({ borderBottomWidth: "1px", borderColor: "border.muted" })}>
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={960}
                        height={540}
                        loading={priority ? "eager" : "lazy"}
                        decoding={priority ? "sync" : "async"}
                        fetchPriority={priority ? "high" : "auto"}
                        className={css({
                            aspectRatio: "16 / 9",
                            w: "full",
                            h: "auto",
                            objectFit: "cover",
                        })}
                    />
                </div>

                <Card.Body className={css({ gap: "2", px: { base: "3", lg: "4" }, py: { base: "3", lg: "4" } })}>
                    <p
                        className={css({
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: { base: "sm", lg: "lg" },
                            color: "fg.default",
                        })}
                    >
                        {slide.title}
                    </p>
                    <p className={css({ fontSize: { base: "2xs", lg: "sm" }, color: "fg.muted" })}>
                        最終更新日: {slide.lastUpdate ? new Date(slide.lastUpdate).toISOString().split("T")[0] : "N/A"}
                    </p>
                </Card.Body>
            </Card.Root>
        </a>
    );
}
