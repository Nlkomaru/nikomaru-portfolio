import { sva } from "styled-system/css";
import { ImageFrame } from "./image-frame";

const bakingStyles = sva({
    slots: ["root", "stack", "back", "front"],
    base: {
        root: {
            w: "full",
        },
        stack: {
            position: "relative",
            w: "25px",
            aspectRatio: "1 / 1",
        },
        back: {
            position: "absolute",
            left: "5px",
            top: "4px",
            transform: "rotate(-6deg)",
            transformOrigin: "left bottom",
            opacity: 0.95,
        },
        front: {
            position: "absolute",
            right: 0,
            bottom: 0.5,
        },
    },
});

export function Baking() {
    const styles = bakingStyles();

    return (
        <div className={styles.root}>
            <div className={styles.stack}>
                <div className={styles.back}>
                    <ImageFrame src="/sweets/napoleon-pastry.avif" alt="Napoleon pastry" />
                </div>
                <div className={styles.front}>
                    <ImageFrame src="/sweets/bonbon-au-chocolat.avif" alt="Bonbon au chocolat" />
                </div>
            </div>
        </div>
    );
}
