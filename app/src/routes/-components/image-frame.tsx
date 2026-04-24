import { sva } from "styled-system/css";

const imageFrameStyles = sva({
    slots: ["root", "frame", "image"],
    base: {
        root: {
            position: "relative",
            display: "block",
        },
        frame: {},
        image: {},
    },
    variants: {
        mode: {
            fixed: {
                root: {
                    w: "25px",
                    h: "21px",
                },
                frame: {
                    w: "25px",
                    h: "21px",
                    borderRadius: "xs",
                    bg: "white",
                    boxShadow: "md",
                },
                image: {
                    position: "absolute",
                    left: "2px",
                    top: "2px",
                    w: "21px",
                    h: "14px",
                    objectFit: "cover",
                    borderRadius: "xs",
                    display: "block",
                },
            },
            fluid: {
                frame: {
                    w: "full",
                    h: "full",
                    borderRadius: "3xl",
                    bg: "white",
                    borderWidth: "1px",
                    borderColor: "border.outline",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
                },
                image: {
                    position: "absolute",
                    inset: 0,
                    w: "full",
                    h: "full",
                    objectFit: "cover",
                    borderRadius: "inherit",
                    display: "block",
                },
            },
        },
    },
    defaultVariants: {
        mode: "fixed",
    },
});

type ImageFrameProps = {
    src: string;
    alt: string;
    loading?: "lazy" | "eager";
    mode?: "fixed" | "fluid";
};

export function ImageFrame({ src, alt, loading = "lazy", mode = "fixed" }: ImageFrameProps) {
    const styles = imageFrameStyles({ mode });

    return (
        <div className={styles.root}>
            <div className={styles.frame} />
            <img src={src} alt={alt} decoding="async" loading={loading} className={styles.image} />
        </div>
    );
}
