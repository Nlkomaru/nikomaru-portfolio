"use client";
import { css } from "@/styled-system/css";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import WorksCard from "~/components/works/works-card";
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
} from "./works-carousel-arrow-buttons";

const embla = css({
    margin: "auto",
    "--slide-height": "19rem",
    "--slide-spacing": "1rem",
    "--slide-size": { base: "100%", md: "50%", lg: "33%" },
    maxWidth: "1536px",
});

const emblaViewport = css({
    overflow: "hidden",
});

const emblaContainer = css({
    display: "flex",
    touchAction: "pan-y pinch-zoom",
    marginLeft: "calc(var(--slide-spacing) * -1)",
});

const emblaSlide = css({
    flex: "0 0 var(--slide-size)",
    minWidth: "0",
    paddingLeft: "var(--slide-spacing)",
});

const emblaControls = css({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    justifyContent: "space-between",
    gap: "1.2rem",
    marginTop: "1.8rem",
});

const emblaButtons = css({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.6rem",
    alignItems: "center",
    _disabled: {
        color: "var(--detail-high-contrast)",
    },
});

type PropType = {
    options?: EmblaOptionsType;
};

const WorksCarousel: React.FC<PropType> = (props) => {
    const { options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ delay: 20 * 1000 }),
    ]);
    const [data, setData] = useState<Works[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/products");
            const result = await response.json<Works[]>();
            setData(result);
        };

        fetchData();
    }, []);

    const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop;

        resetOrStop();
    }, []);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi, onNavButtonClick);

    return (
        <section className={embla}>
            <div className={emblaViewport} ref={emblaRef}>
                <div className={emblaContainer}>
                    {data.map((product) => (
                        <div className={emblaSlide} key={product.id}>
                            <WorksCard works={product} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={emblaControls}>
                <div className={emblaButtons}>
                    <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                    />
                </div>
            </div>
        </section>
    );
};

export default WorksCarousel;
