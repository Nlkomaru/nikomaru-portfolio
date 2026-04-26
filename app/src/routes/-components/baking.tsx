import { sva } from "styled-system/css";
import { MiniImageFrame } from "./mini-image-frame";

const bakingStyles = sva({
    slots: ["root", "stack", "back", "front"],
    base: {
        root: {
            w: "full",
        },
        stack: {
            position: "relative",
            w: "27px",
            aspectRatio: "1 / 1",
        },
        back: {
            position: "absolute",
            left: "4px",
            top: "3px",
            transform: "rotate(-6deg)",
            transformOrigin: "left bottom",
            opacity: 0.95,
        },
        front: {
            position: "absolute",
            right: 0,
            bottom: 0.9,
        },
    },
});

export function Baking() {
    const styles = bakingStyles();

    return (
        <div className={styles.root}>
            <div className={styles.stack}>
                <div className={styles.back}>
                    <MiniImageFrame src="/sweets/napoleon-pastry.avif" alt="Napoleon pastry" />
                </div>
                <div className={styles.front}>
                    <MiniImageFrame src="/sweets/bonbon-au-chocolat.avif" alt="Bonbon au chocolat" />
                </div>
            </div>
        </div>
    );
}
