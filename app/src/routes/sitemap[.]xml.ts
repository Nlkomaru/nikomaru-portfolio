import { createFileRoute } from "@tanstack/react-router";
import { buildSitemap } from "./-functions/build-sitemap";
import { projectSlugs } from "./(site)/_main/projects/-content/project-slugs";
import { getSlides } from "./(site)/_main/talks/-functions/get-slides";

export const Route = createFileRoute("/sitemap.xml")({
    server: {
        handlers: {
            GET: async () => {
                // The talks archive and sitemap must expose the same set of public slides (excluding draft and private).
                const slides = await getSlides();
                const publicSlides = slides.filter((slide) => slide.type === "public");
                const sitemap = buildSitemap(
                    projectSlugs,
                    publicSlides.map((slide) => slide.id),
                );

                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml; charset=utf-8",
                        "Cache-Control": "public, max-age=300",
                    },
                });
            },
        },
    },
});
