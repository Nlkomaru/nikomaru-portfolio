import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { sva } from "styled-system/css";
import { m } from "../../paraglide/messages";
import { getSlides } from "./-functions/get-slides";

const talksPageStyles = sva({
    slots: ["root", "title", "grid"],
    base: {
        root: {
            maxW: "6xl",
            mx: "auto",
            px: "4",
            py: "8",
        },
        title: {
            mb: "8",
            fontSize: "xl",
            color: "fg.default",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: {
                base: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: "8",
            w: "full",
        },
    },
});

export const Route = createFileRoute("/talks/")({
    loader: () => getSlides(),
    staleTime: 1000 * 60 * 5,
    component: SlidesPage,
});

function SlidesPage() {
    const slides = Route.useLoaderData();
    const publicSlides = slides.filter((slide) => slide.type === "public");
    const styles = talksPageStyles();

    return (
        <div className={styles.root}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                    key={m.slidesTitle()}
                    className={styles.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                >
                    {m.slidesTitle()}
                </motion.h1>
            </AnimatePresence>

            <div className={styles.grid}>
                {publicSlides.map((slide) => (
                    <div key={slide.id}>
                        <h1>{slide.title}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}
