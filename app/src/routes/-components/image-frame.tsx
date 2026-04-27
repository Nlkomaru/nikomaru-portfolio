import { sva } from "styled-system/css";

const imageFrameStyles = sva({
    slots: ["root", "media", "image", "title"],
    base: {
        root: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "full",
            bg: "white",
            borderRadius: "md",
            px: "3",
            pt: "3",
            pb: "2",
            gap: "1",
            boxShadow: "0px 0px 1px 0px rgba(24,24,27,0.30), 0px 4px 8px 0px rgba(24,24,27,0.10)",
        },
        media: {
            w: "full",
            aspectRatio: "300 / 200",
            position: "relative",
        },
        image: {
            position: "absolute",
            inset: 0,
            w: "full",
            h: "full",
            objectFit: "cover",
            borderRadius: "sm",
            display: "block",
        },
        title: {
            color: "gray.700",
            fontFamily: '"Caveat", sans-serif',
            fontWeight: "normal",
            fontSize: "3xl",
            textAlign: "center",
            w: "calc(100% - 1rem)",
            h: "100%",
            lineHeight: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
    },
});

type ImageFrameProps = {
    src: string;
    alt: string;
    title: string;
    loading: "eager" | "lazy";
};

export function ImageFrame({ src, alt, title, loading }: ImageFrameProps) {
    const styles = imageFrameStyles();

    return (
        <figure className={styles.root}>
            <div className={styles.media}>
                <img src={src} alt={alt} decoding="async" loading={loading} draggable={false} className={styles.image} />
            </div>
            <figcaption className={styles.title}>{title}</figcaption>
        </figure>
    );
}
