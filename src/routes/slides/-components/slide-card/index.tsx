import type { Slide } from "../../-types/slide";

interface SlideCardProps {
    slide: Slide;
    priority?: boolean;
}

export default function SlideCard({ slide, priority = false }: SlideCardProps) {
    return (
        <a
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
        >
            <div className="w-full rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="border-b border-gray-300">
                    <img
                        src={slide.image}
                        alt={slide.title}
                        width={960}
                        height={540}
                        loading={priority ? "eager" : "lazy"}
                        decoding={priority ? "sync" : "async"}
                        fetchPriority={priority ? "high" : "auto"}
                        className="aspect-video w-full h-auto object-cover"
                    />
                </div>

                <div className="px-2 py-1 lg:px-4 lg:py-2">
                    <p className="text-sm lg:text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                        {slide.title}
                    </p>
                </div>

                <div className="px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-base text-gray-500">
                    最終更新日:{" "}
                    {slide.lastUpdate
                        ? new Date(slide.lastUpdate).toISOString().split("T")[0]
                        : "N/A"}
                </div>
            </div>
        </a>
    );
}
