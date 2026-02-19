import { createFileRoute } from "@tanstack/react-router";
import SlideCard from "./-components/slide-card";
import { getSlides } from "./-functions/get-slides";

export const Route = createFileRoute("/slides/")({
    head: () => ({
        meta: [
            { title: "スライド一覧 | nikomaru.dev" },
            {
                name: "description",
                content: "nikomaruが作製したスライドの一覧ページです。",
            },
        ],
    }),
    loader: () => getSlides(),
    component: SlidesPage,
});

function SlidesPage() {
    const slides = Route.useLoaderData();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-xl mb-8">作製したスライド一覧</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {slides
                    .filter((slide) => slide.type === "public")
                    .map((slide) => (
                        <SlideCard slide={slide} key={slide.id} />
                    ))}
            </div>
        </div>
    );
}
