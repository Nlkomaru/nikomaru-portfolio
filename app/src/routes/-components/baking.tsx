import { sva } from "styled-system/css";
import { MiniImageFrame } from "./mini-image-frame";
import { sweets } from "./sweets";

const bakingStyles = sva({
    slots: ["root", "stack", "back", "front"],
    base: {
        root: {
            display: "block",
            w: "27px",
            h: "27px",
        },
        stack: {
            position: "relative",
            w: "27px",
            h: "27px",
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
    const backSweet = sweets.find((sweet) => sweet.title === "Napoleon pie");
    const frontSweet = sweets.find((sweet) => sweet.title === "Bonbon au chocolat");

    if (!backSweet?.miniPreviewSrc || !frontSweet?.miniPreviewSrc) {
        return null;
    }

    return (
        <div className={styles.root}>
            <div className={styles.stack}>
                <div className={styles.back}>
                    <MiniImageFrame src={backSweet.miniPreviewSrc} alt={backSweet.alt} blurhash={backSweet.blurhash} />
                </div>
                <div className={styles.front}>
                    <MiniImageFrame
                        src={frontSweet.miniPreviewSrc}
                        alt={frontSweet.alt}
                        blurhash={frontSweet.blurhash}
                    />
                </div>
            </div>
        </div>
    );
}
