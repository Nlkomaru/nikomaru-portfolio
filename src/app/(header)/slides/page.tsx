import { css } from "@/styled-system/css";
import SlideCard from "~/components/slides/slide-card";
import { getSlides } from "~/lib/slides";

export default async function Page() {
    const slideArray = await getSlides();

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
                    <SlideCard slide={slide} key={slide.id} />
                ))}
            </div>
        </>
    );
}
