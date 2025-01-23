import { css } from "@/styled-system/css";
import type { EmblaOptionsType } from "embla-carousel";
import FakeWorksList from "~/components/works/fake-works-list";
import { NextButton, PrevButton } from "./works-carousel-arrow-buttons";

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

const FakeWorksCarousel: React.FC<PropType> = () => {
    return (
        <section className={embla}>
            <div className={emblaViewport}>
                <FakeWorksList />
            </div>

            <div className={emblaControls}>
                <div className={emblaButtons}>
                    <PrevButton />
                    <NextButton />
                </div>
            </div>
        </section>
    );
};

export default FakeWorksCarousel;
