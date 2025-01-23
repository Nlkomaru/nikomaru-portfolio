import { css } from "@/styled-system/css";
import type React from "react";
import FakeWorksCard from "~/components/works/fake-works-card";

const emblaSlide = css({
    flex: "0 0 var(--slide-size)",
    minWidth: "0",
    paddingLeft: "var(--slide-spacing)",
});

const emblaContainer = css({
    display: "flex",
    touchAction: "pan-y pinch-zoom",
    marginLeft: "calc(var(--slide-spacing) * -1)",
});

const FakeWorksList: React.FC = () => {
    return (
        <div className={emblaContainer}>
            {[1, 2, 3].map((works) => (
                <div className={emblaSlide} key={works}>
                    <FakeWorksCard />
                </div>
            ))}
        </div>
    );
};

export default FakeWorksList;
