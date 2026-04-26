import { Dialog, Portal } from "@chakra-ui/react";
import { motion, type PanInfo } from "framer-motion";
import { useState } from "react";
import { sva } from "styled-system/css";
import { Baking } from "./baking";
import { ImageFrame } from "./image-frame";

const sweets = [
    { src: "/sweets/bonbon-au-chocolat.avif", alt: "Bonbon au chocolat", title: "Bonbon au chocolat" },
    { src: "/sweets/petit-strawberry-tart.avif", alt: "Petit strawberry tart", title: "Petit strawberry tart" },
    { src: "/sweets/souffle-pancakes.avif", alt: "Soufflé pancakes", title: "Soufflé pancakes" },
    { src: "/sweets/chocolate-tart.avif", alt: "Chocolate tart", title: "Chocolate tart" },
    { src: "/sweets/strawberry-tart.avif", alt: "Strawberry tart", title: "Strawberry tart" },
    { src: "/sweets/shortcake.avif", alt: "Shortcake", title: "Shortcake" },
    { src: "/sweets/napoleon-pie.avif", alt: "Napoleon pie", title: "Napoleon pie" },
    { src: "/sweets/creme-brulee.avif", alt: "Crème brûlée", title: "Crème brûlée" },
    { src: "/sweets/mont-blanc-tart.avif", alt: "Mont blanc tart", title: "Mont blanc tart" },
] as const;

const swipeConfidenceThreshold = 8_000;
const swipeDistanceThreshold = 90;
const cardExitDistance = 560;
const minCardTilt = 2;
const maxCardTilt = 7;

const stackPlacement = { x: 0, y: 0, scale: 1 } as const;

type SwipeExit = {
    x: number;
    y: number;
    rotate: number;
};

const bakingGalleryStyles = sva({
    slots: ["root", "trigger", "backdrop", "positioner", "deck", "card"],
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
        deck: {
            position: "relative",
            w: "min(92vw, 460px)",
            h: { base: "320px", md: "360px" },
            cursor: "grab",
            touchAction: "none",
            bg: "transparent",
            boxShadow: "none",
            border: "none",
            outline: "none",
            _active: {
                cursor: "grabbing",
            },
        },
        card: {
            position: "absolute",
            inset: 0,
            w: "full",
            px: "1",
            transformOrigin: "center center",
            userSelect: "none",
            "& img": {
                pointerEvents: "none",
                userSelect: "none",
            },
        },
    },
});

function getSwipeConfidence(distance: number, velocity: number) {
    return distance * velocity;
}

function hashText(text: string) {
    return [...text].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0);
}

function getCardTilt(seed: string) {
    const hash = hashText(seed);
    const sign = hash % 2 === 0 ? 1 : -1;
    const range = maxCardTilt - minCardTilt;

    return sign * (minCardTilt + (hash % (range + 1)));
}

export function BakingGallery() {
    const styles = bakingGalleryStyles();
    const [deck, setDeck] = useState(() => [...sweets]);
    const [swipeExit, setSwipeExit] = useState<SwipeExit | null>(null);
    const [open, setOpen] = useState(false);

    const sendTopCardToBack = () => {
        setDeck(([topCard, ...restCards]) => (topCard ? [...restCards, topCard] : restCards));
        setSwipeExit(null);
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        const distance = Math.hypot(offset.x, offset.y);
        const speed = Math.hypot(velocity.x, velocity.y);
        const swipe = getSwipeConfidence(distance, speed);

        if (distance < swipeDistanceThreshold && swipe < swipeConfidenceThreshold) {
            return;
        }

        const fallbackX = offset.x === 0 && offset.y === 0 ? 1 : offset.x;
        const fallbackY = offset.x === 0 && offset.y === 0 ? 0 : offset.y;
        const vectorLength = Math.hypot(fallbackX, fallbackY);
        const rotate = Math.max(-18, Math.min(18, offset.x / 8 || velocity.x / 80));

        setSwipeExit({
            x: (fallbackX / vectorLength) * cardExitDistance,
            y: (fallbackY / vectorLength) * cardExitDistance,
            rotate,
        });
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
                    <Dialog.Content asChild>
                        <div className={styles.deck}>
                            {deck.map((sweet, position) => {
                                const isTopCard = position === 0;
                                const rotate = getCardTilt(`${sweet.title}:${sweet.src}`);

                                return (
                                    <motion.div
                                        key={sweet.src}
                                        className={styles.card}
                                        style={{
                                            zIndex: sweets.length - position,
                                            pointerEvents: isTopCard ? "auto" : "none",
                                        }}
                                        initial={false}
                                        animate={
                                            isTopCard && swipeExit
                                                ? swipeExit
                                                : {
                                                      ...stackPlacement,
                                                      rotate,
                                                      opacity: 1,
                                                  }
                                        }
                                        transition={{
                                            type: "spring",
                                            stiffness: 600,
                                            damping: 48,
                                            mass: 1,
                                            restDelta: 0.5,
                                            restSpeed: 1,
                                        }}
                                        drag={isTopCard && !swipeExit}
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        dragElastic={0.9}
                                        dragMomentum={false}
                                        dragTransition={{
                                            bounceStiffness: 600,
                                            bounceDamping: 48,
                                            restDelta: 0.5,
                                            restSpeed: 1,
                                        }}
                                        onDragEnd={isTopCard ? handleDragEnd : undefined}
                                        onAnimationComplete={() => {
                                            if (isTopCard && swipeExit) {
                                                sendTopCardToBack();
                                            }
                                        }}
                                    >
                                        <ImageFrame src={sweet.src} alt={sweet.alt} title={sweet.title} />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
