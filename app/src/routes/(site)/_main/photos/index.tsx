import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { sva } from "styled-system/css";
import { PhotoGallery } from "./-components/photo-gallery";
import { getPhotoEntries } from "./-functions/get-photo-entries";

const photoPageStyles = sva({
    slots: ["root", "container", "header", "headerEyebrow", "headerTitle", "headerDescription"],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
        },
        container: {
            maxW: "104rem",
            mx: "auto",
            px: { base: "4", md: "12" },
            py: { base: "6", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: "8",
        },
        header: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
        },
        headerTitle: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: { base: "3xl", md: "4xl" },
            lineHeight: "1.05",
            letterSpacing: "-0.025em",
            color: "fg.subtle",
        },
        headerDescription: {
            maxW: "xl",
            fontSize: { base: "md", md: "lg" },
            lineHeight: "1.65",
        },
    },
});

const photoHeaderMotion = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export const Route = createFileRoute("/(site)/_main/photos/")({
    ssr: false,
    loader: () => getPhotoEntries(),
    staleTime: 1000 * 60 * 5,
    component: PhotoPage,
});

function PhotoPage() {
    const photos = Route.useLoaderData();
    const styles = photoPageStyles();

    return (
        <main className={styles.root}>
            <section className={styles.container}>
                <motion.header className={styles.header} variants={photoHeaderMotion} initial="hidden" animate="show">
                    <h1 className={styles.headerTitle}>Photos</h1>
                </motion.header>
                <PhotoGallery photos={photos} />
            </section>
        </main>
    );
}
