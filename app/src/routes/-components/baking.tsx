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
        <div className={styles.root} style={{ width: 27, height: 27 }}>
            <div className={styles.stack} style={{ position: "relative", width: 27, height: 27 }}>
                <div
                    className={styles.back}
                    style={{
                        position: "absolute",
                        left: 4,
                        top: 3,
                        transform: "rotate(-6deg)",
                        transformOrigin: "left bottom",
                        opacity: 0.95,
                    }}
                >
                    <MiniImageFrame src="/sweets/mini-preview/napoleon-pastry.avif" alt="Napoleon pastry" />
                </div>
                <div className={styles.front} style={{ position: "absolute", right: 0, bottom: 0 }}>
                    <MiniImageFrame src="/sweets/mini-preview/bonbon-au-chocolat.avif" alt="Bonbon au chocolat" />
                </div>
            </div>
        </div>
    );
}
