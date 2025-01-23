import { css } from "@/styled-system/css";
import type { EmblaOptionsType } from "embla-carousel";
import { titleStyle } from "~/components/aboutme";
import WorksCarousel from "~/components/works/works-carousel";

const OPTIONS: EmblaOptionsType = {
    loop: true,
    slidesToScroll: 1,
    dragFree: true,
};

export default function Home() {
    return (
        <div
            className={css({
                margin: "10vh auto",
                padding: {
                    base: "32px 32px",
                },
                maxWidth: "1600px",
            })}
        >
            <h1 className={titleStyle}>Works</h1>
            <WorksCarousel options={OPTIONS} />
        </div>
    );
}
