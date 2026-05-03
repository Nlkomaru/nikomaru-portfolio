import { createFileRoute } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { PhotoGallery } from "./-components/photo-gallery";
import { getPhotoEntries } from "./-functions/get-photo-entries";

const photoPageStyles = sva({
    slots: ["root", "container", "header", "headerEyebrow", "headerTitle", "headerDescription"],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
            color: "fg.default",
        },
        container: {
            maxW: "7xl",
            mx: "auto",
            px: { base: "6", md: "12" },
            py: { base: "6", md: "10" },
            display: "flex",
            flexDirection: "column",
            gap: "8",
        },
        header: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
        },
        headerEyebrow: {
            color: "fg.muted",
            fontFamily: "mono",
            fontSize: "0.6875rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
        },
        headerTitle: {
            fontFamily: "heading",
            fontWeight: "semibold",
            fontSize: { base: "3xl", md: "4xl" },
            lineHeight: "1.05",
            letterSpacing: "-0.025em",
            color: "fg.default",
        },
        headerDescription: {
            maxW: "xl",
            color: "fg.subtle",
            fontSize: { base: "md", md: "lg" },
            lineHeight: "1.65",
        },
    },
});

export const Route = createFileRoute("/photos/")({
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
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>Photos</h1>
                </header>
                <PhotoGallery photos={photos} />
            </section>
        </main>
    );
}
