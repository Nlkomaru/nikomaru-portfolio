import { sva } from "styled-system/css";

const miniImageFrameStyles = sva({
    slots: ["root", "frame", "image"],
    base: {
        root: {
            position: "relative",
            display: "block",
            w: "full",
            h: "full",
        },
        frame: {
            w: "calc(9px * 3 + 2px)",
            h: "calc(9px * 2 + 5px)",
            borderRadius: "xs",
            bg: "white",
            boxShadow: "md",
        },
        image: {
            position: "absolute",
            left: "1px",
            top: "1px",
            w: "calc(9px * 3)",
            h: "calc(9px * 2)",
            objectFit: "cover",
            borderRadius: "xs",
            display: "block",
        },
    },
});

type MiniImageFrameProps = {
    src: string;
    alt: string;
};

export function MiniImageFrame({ src, alt }: MiniImageFrameProps) {
    const styles = miniImageFrameStyles();

    return (
        <div className={styles.root}>
            <div className={styles.frame} />
            <img src={src} alt={alt} decoding="async" loading="lazy" className={styles.image} />
        </div>
    );
}
