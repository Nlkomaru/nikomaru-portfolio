import { css } from "@/styled-system/css";
import SlideCard from "~/components/slides/slide-card";
import { fetcher } from "~/lib/fetcher";

const cache = new Map<string, { data: Slide[]; timestamp: number }>();

export default async function Page() {
    const cacheKey = "/api/slides/list";
    const cacheEntry = cache.get(cacheKey);
    const oneHour = 1;
    const now = Date.now();

    let slideArray: Slide[];

    if (cacheEntry) {
        slideArray = cacheEntry.data;
        if (now - cacheEntry.timestamp >= oneHour) {
            fetcher(cacheKey)
                .then((res) => res.json<Slide[]>())
                .then((newData) => {
                    cache.set(cacheKey, { data: newData, timestamp: now });
                });
        }
    } else {
        slideArray = await fetcher(cacheKey).then((res) => res.json<Slide[]>());
        cache.set(cacheKey, { data: slideArray, timestamp: now });
    }

    for (const slide of slideArray) {
        slide.lastUpdate = slide.lastUpdate
            ? new Date(slide.lastUpdate)
            : undefined;
    }

    return (
        <>
            <h1
                className={css({
                    fontSize: "xl",
                    margin: "32px 0px",
                })}
            >
                作製したスライド一覧
            </h1>
            <div
                className={css({
                    display: "grid",
                    gridTemplateColumns: {
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: "32px",
                    width: "100%",
                    justifyContent: "space-between",
                })}
            >
                {slideArray.map((slide) => (
                    <div key={slide.id} className={css({})}>
                        <SlideCard slide={slide} />
                    </div>
                ))}
            </div>
        </>
    );
}
