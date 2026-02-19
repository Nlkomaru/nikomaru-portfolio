import { createFileRoute } from "@tanstack/react-router";
import SlideCard from "./-components/slide-card";
import { getSlides } from "./-functions/get-slides";

const ABOVE_FOLD_COUNT = 3;

export const Route = createFileRoute("/slides/")({
    head: ({ loaderData }) => {
        const publicSlides = loaderData?.filter((s) => s.type === "public");
        const firstImage = publicSlides?.[0]?.image;

        return {
            meta: [
                { title: "スライド一覧 | nikomaru.dev" },
                {
                    name: "description",
                    content: "nikomaruが作製したスライドの一覧ページです。",
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
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-xl mb-8">作製したスライド一覧</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {publicSlides.map((slide, i) => (
                    <SlideCard slide={slide} key={slide.id} priority={i < ABOVE_FOLD_COUNT} />
                ))}
            </div>
        </div>
    );
}
