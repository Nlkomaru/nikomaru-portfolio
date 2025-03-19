"use client";
import { css } from "@/styled-system/css";
import { Suspense, useEffect, useState } from "react";
import FakeSlideCard from "~/components/slides/fake-slide-card";
import SlideCard from "~/components/slides/slide-card";
import type { Slide } from "~/lib/type";

export default function Page() {
    const [slideArray, setSlideArray] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await fetch("/api/slides/list").then((res) =>
                    res.json<Slide[]>(),
                );
                const sortedData = data
                    .map((slide) => ({
                        ...slide,
                        lastUpdate: slide.lastUpdate
                            ? new Date(slide.lastUpdate)
                            : undefined,
                    }))
                    .sort((a, b) => {
                        if (!a.lastUpdate) return 1;
                        if (!b.lastUpdate) return -1;
                        return b.lastUpdate.getTime() - a.lastUpdate.getTime();
                    });
                setSlideArray(sortedData);
            } catch (error) {
                console.error("スライドの取得に失敗しました:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlides();
    }, []);

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
            {isLoading ? (
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
                    {Array.from({ length: 3 }, (_, i) => (
                        <FakeSlideCard
                            key={`loading-skeleton-${crypto.randomUUID()}`}
                        />
                    ))}
                </div>
            ) : slideArray.length === 0 ? (
                <p
                    className={css({
                        textAlign: "center",
                        margin: "32px 0",
                    })}
                >
                    スライドがまだありません
                </p>
            ) : (
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
                        <Suspense key={slide.id} fallback={<FakeSlideCard />}>
                            <SlideCard slide={slide} />
                        </Suspense>
                    ))}
                </div>
            )}
        </>
    );
}
