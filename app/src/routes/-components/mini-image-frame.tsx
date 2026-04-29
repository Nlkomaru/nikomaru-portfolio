import { sva } from "styled-system/css";

const MINI_IMAGE_W = 9 * 3;
const MINI_IMAGE_H = 9 * 2;
const MINI_FRAME_W = MINI_IMAGE_W + 2;
const MINI_FRAME_H = MINI_IMAGE_H + 5;

const miniImageFrameStyles = sva({
    slots: ["root", "frame", "image"],
    base: {
        root: {
            position: "relative",
            display: "block",
            w: `${MINI_FRAME_W}px`,
            h: `${MINI_FRAME_H}px`,
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
            <img src={src} alt={alt} width={MINI_IMAGE_W} height={MINI_IMAGE_H} className={styles.image} />
        </div>
    );
}
