import { Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { getLocale } from "../../paraglide/runtime";
import { BakingGallery } from "./baking-gallery";

const introP3Styles = sva({
    slots: ["baking", "bakingInner"],
    base: {
        baking: {
            display: "inline-block",
            verticalAlign: "middle",
            position: "relative",
            width: "27px",
            height: "1em",
            mx: "2",
        },
        bakingInner: {
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-60%)",
            lineHeight: 0,
        },
    },
});

export function IntroP3() {
    const locale = getLocale();
    const styles = introP3Styles();
    if (locale === "ja") {
        return (
            <p>
                また、プログラミング以外には、
                <span className={styles.baking}>
                    <span className={styles.bakingInner}>
                        <BakingGallery />
                    </span>
                </span>{" "}
                お菓子作りや、最近カメラを購入したことをきっかけに始めた
                <Link to="/photos" data-inline-link>
                    写真撮影
                </Link>
                などが趣味です。試行錯誤しながら学ぶこと、そして技術と創作の両方に喜びを見いだすことを大切にしています。
            </p>
        );
    }

    return (
        <p>
            When I&apos;m not coding, I&apos;m usually{" "}
            <span className={styles.baking}>
                <span className={styles.bakingInner}>
                    <BakingGallery />
                </span>
            </span>{" "}
            baking or{" "}
            <Link to="/photos" data-inline-link>
                taking photos
            </Link>
            . I started photography after buying a camera recently, and I enjoy creating things with care—learning
            through trial and error along the way.
        </p>
    );
}
