import { sva } from "styled-system/css";
import { Card } from "../../../components/ui";
import type { Slide } from "../-types/slide";

const slideCardStyles = sva({
    slots: ["link", "card", "imageWrap", "image", "body", "title", "updatedAt"],
    base: {
        link: {
            display: "block",
            w: "full",
        },
        card: {
            w: "full",
            overflow: "hidden",
            transition: "box-shadow 0.2s ease",
            _hover: {
                boxShadow: "md",
            },
        },
        imageWrap: {
            borderBottomWidth: "1px",
            borderColor: "border.muted",
        },
        image: {
            aspectRatio: "16 / 9",
            w: "full",
            h: "auto",
            objectFit: "cover",
        },
        body: {
            gap: "2",
            px: { base: "3", lg: "4" },
            py: { base: "3", lg: "4" },
        },
        title: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: { base: "sm", lg: "lg" },
            color: "fg.default",
        },
        updatedAt: {
            fontSize: { base: "2xs", lg: "sm" },
            color: "fg.muted",
        },
    },
});

interface SlideCardProps {
    slide: Slide;
    priority?: boolean;
}

export default function SlideCard({ slide, priority = false }: SlideCardProps) {
    const styles = slideCardStyles();

    return (
        <a href={slide.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <Card.Root variant="outline" className={styles.card}>
                <div className={styles.imageWrap}>
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={960}
                        height={540}
                        loading={priority ? "eager" : "lazy"}
                        decoding={priority ? "sync" : "async"}
                        fetchPriority={priority ? "high" : "auto"}
                        className={styles.image}
                    />
                </div>

                <Card.Body className={styles.body}>
                    <p className={styles.title}>{slide.title}</p>
                    <p className={styles.updatedAt}>
                        最終更新日: {slide.lastUpdate ? new Date(slide.lastUpdate).toISOString().split("T")[0] : "N/A"}
                    </p>
                </Card.Body>
            </Card.Root>
        </a>
    );
}
