import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "styled-system/css";
import { m } from "../../paraglide/messages";
import SlideCard from "./-components/slide-card";
import { getSlides } from "./-functions/get-slides";

const ABOVE_FOLD_COUNT = 3;

export const Route = createFileRoute("/talks/")({
    head: ({ loaderData }) => {
        const publicSlides = loaderData?.filter((s) => s.type === "public");
        const firstImage = publicSlides?.[0]?.image;

        return {
            meta: [
                { title: `${m.slidesTitle()} | nikomaru.dev` },
                {
                    name: "description",
                    content: m.slidesDescription(),
                },
            ],
            links: firstImage ? [{ rel: "preload", href: firstImage, as: "image" }] : [],
        };
    },
    loader: () => getSlides(),
    staleTime: 1000 * 60 * 5,
    component: SlidesPage,
});

function SlidesPage() {
    const slides = Route.useLoaderData();
    const publicSlides = slides.filter((slide) => slide.type === "public");

    return (
        <div className={css({ maxW: "6xl", mx: "auto", px: "4", py: "8" })}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                    key={m.slidesTitle()}
                    className={css({ mb: "8", fontSize: "xl", color: "fg.default" })}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                >
                    {m.slidesTitle()}
                </motion.h1>
            </AnimatePresence>

            <div
                className={css({
                    display: "grid",
                    gridTemplateColumns: {
                        base: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: "8",
                    w: "full",
                })}
            >
                {publicSlides.map((slide, i) => (
                    <SlideCard slide={slide} key={slide.id} priority={i < ABOVE_FOLD_COUNT} />
                ))}
            </div>
        </div>
    );
}
