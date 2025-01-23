"use client";

import { css } from "@/styled-system/css";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import dynamic from "next/dynamic";
import type React from "react";
import { Suspense } from "react";
import { useCallback } from "react";
import FakeWorksList from "./fake-works-list";
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
} from "./works-carousel-arrow-buttons";

const WorksList = dynamic(() =>
    import("./works-list").then((mod) => mod.WorksList),
);

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
                <Suspense fallback={<FakeWorksList />}>
                    <WorksList />
                </Suspense>
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
