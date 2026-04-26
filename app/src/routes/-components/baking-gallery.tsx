import { Dialog, Portal } from "@chakra-ui/react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useState } from "react";
import { sva } from "styled-system/css";
import { Baking } from "./baking";
import { ImageFrame } from "./image-frame";

const sweets = [
    {
        src: "/sweets/napoleon-pastry.avif",
        alt: "Napoleon pastry",
        title: "Napoleon pastry",
    },
    {
        src: "/sweets/bonbon-au-chocolat.avif",
        alt: "Bonbon au chocolat",
        title: "Bonbon au chocolat",
    },
    {
        src: "/sweets/chocolate-cake.avif",
        alt: "Chocolate cake",
        title: "Chocolate cake",
    },
    {
        src: "/sweets/lemon-tart.avif",
        alt: "Lemon tart",
        title: "Lemon tart",
    },
] as const;

const swipeConfidenceThreshold = 10_000;

const bakingGalleryStyles = sva({
    slots: [
        "root",
        "trigger",
        "backdrop",
        "positioner",
        "content",
        "closeButton",
        "viewport",
        "slide",
        "controls",
        "navButton",
        "dots",
        "dot",
    ],
    base: {
        root: {
            display: "inline-flex",
            verticalAlign: "middle",
        },
        trigger: {
            appearance: "none",
            border: 0,
            p: 0,
            bg: "transparent",
            color: "inherit",
            cursor: "pointer",
            borderRadius: "sm",
            transition: "transform 0.2s ease",
            _hover: {
                transform: "rotate(-2deg) scale(1.06)",
            },
            _active: {
                transform: "rotate(-2deg) scale(0.98)",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "border.outline",
                outlineOffset: "3px",
            },
        },
        backdrop: {
            position: "fixed",
            inset: 0,
            zIndex: 50,
            bg: "black/55",
            backdropFilter: "blur(8px)",
        },
        positioner: {
            position: "fixed",
            inset: 0,
            zIndex: 51,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: "5",
        },
        content: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            w: "min(92vw, 460px)",
            outline: "none",
        },
        closeButton: {
            position: "absolute",
            top: "-12",
            right: "0",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            w: "9",
            h: "9",
            borderRadius: "full",
            borderWidth: "1px",
            borderColor: "white/30",
            bg: "white/15",
            color: "white",
            cursor: "pointer",
            fontSize: "xl",
            lineHeight: 1,
            backdropFilter: "blur(8px)",
            _hover: {
                bg: "white/25",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "white",
                outlineOffset: "2px",
            },
        },
        viewport: {
            position: "relative",
            w: "full",
            overflow: "hidden",
            cursor: "grab",
            _active: {
                cursor: "grabbing",
            },
        },
        slide: {
            w: "full",
            px: "1",
        },
        controls: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4",
            mt: "5",
        },
        navButton: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            w: "10",
            h: "10",
            borderRadius: "full",
            borderWidth: "1px",
            borderColor: "white/30",
            bg: "white/15",
            color: "white",
            cursor: "pointer",
            fontSize: "xl",
            lineHeight: 1,
            backdropFilter: "blur(8px)",
            _hover: {
                bg: "white/25",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "white",
                outlineOffset: "2px",
            },
        },
        dots: {
            display: "flex",
            alignItems: "center",
            gap: "2",
        },
        dot: {
            w: "2",
            h: "2",
            borderRadius: "full",
            border: 0,
            bg: "white/45",
            cursor: "pointer",
            transition: "background-color 0.2s ease, transform 0.2s ease",
            "&[data-active=true]": {
                bg: "white",
                transform: "scale(1.35)",
            },
            _focusVisible: {
                outline: "2px solid",
                outlineColor: "white",
                outlineOffset: "3px",
            },
        },
    },
});

function wrapSweetIndex(index: number) {
    return (index + sweets.length) % sweets.length;
}

function getSwipeConfidence(offset: number, velocity: number) {
    return Math.abs(offset) * velocity;
}

export function BakingGallery() {
    const styles = bakingGalleryStyles();
    const [[currentIndex, direction], setPage] = useState([0, 0]);
    const [open, setOpen] = useState(false);
    const currentSweet = sweets[currentIndex];

    const paginate = (newDirection: number) => {
        setPage(([page]) => [wrapSweetIndex(page + newDirection), newDirection]);
    };

    const showSweet = (nextIndex: number) => {
        if (nextIndex === currentIndex) {
            return;
        }

        setPage(([page]) => [nextIndex, nextIndex > page ? 1 : -1]);
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        const swipe = getSwipeConfidence(offset.x, velocity.x);

        if (swipe < -swipeConfidenceThreshold) {
            paginate(1);
            return;
        }

        if (swipe > swipeConfidenceThreshold) {
            paginate(-1);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)} placement="center">
            <div className={styles.root}>
                <button
                    type="button"
                    className={styles.trigger}
                    aria-label="Open baking gallery"
                    onClick={() => setOpen(true)}
                >
                    <Baking />
                </button>
            </div>

            <Portal>
                <Dialog.Backdrop className={styles.backdrop} />
                <Dialog.Positioner className={styles.positioner}>
                    <Dialog.Content className={styles.content}>
                        <Dialog.CloseTrigger className={styles.closeButton} aria-label="Close baking gallery">
                            x
                        </Dialog.CloseTrigger>

                        <div className={styles.viewport}>
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={currentSweet.src}
                                    className={styles.slide}
                                    custom={direction}
                                    initial={{
                                        opacity: 0,
                                        x: direction >= 0 ? 140 : -140,
                                        rotate: direction >= 0 ? 4 : -4,
                                    }}
                                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                                    exit={{
                                        opacity: 0,
                                        x: direction >= 0 ? -140 : 140,
                                        rotate: direction >= 0 ? -4 : 4,
                                    }}
                                    transition={{ type: "spring", stiffness: 320, damping: 34 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.65}
                                    onDragEnd={handleDragEnd}
                                >
                                    <ImageFrame
                                        src={currentSweet.src}
                                        alt={currentSweet.alt}
                                        title={currentSweet.title}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className={styles.controls}>
                            <button
                                type="button"
                                className={styles.navButton}
                                aria-label="Show previous sweet"
                                onClick={() => paginate(-1)}
                            >
                                {"<"}
                            </button>
                            <nav className={styles.dots} aria-label="Baking gallery pages">
                                {sweets.map((sweet, index) => (
                                    <button
                                        key={sweet.src}
                                        type="button"
                                        className={styles.dot}
                                        data-active={index === currentIndex}
                                        aria-label={`Show ${sweet.title}`}
                                        onClick={() => showSweet(index)}
                                    />
                                ))}
                            </nav>
                            <button
                                type="button"
                                className={styles.navButton}
                                aria-label="Show next sweet"
                                onClick={() => paginate(1)}
                            >
                                {">"}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
