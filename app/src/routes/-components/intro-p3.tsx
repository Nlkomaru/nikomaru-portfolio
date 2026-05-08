import { Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { getLocale } from "../../paraglide/runtime";
import { BakingGallery } from "./baking-gallery";
import { IntroBudouxText } from "./intro-budoux-text";

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
            <p lang={locale}>
                <IntroBudouxText locale={locale} text="また、プログラミング以外には、" />
                <span className={styles.baking}>
                    <span className={styles.bakingInner}>
                        <BakingGallery />
                    </span>
                </span>{" "}
                <IntroBudouxText locale={locale} text="お菓子作りや、最近カメラを購入したことをきっかけに始めた" />
                <Link to="/photos" data-inline-link>
                    写真撮影
                </Link>
                <IntroBudouxText
                    locale={locale}
                    text="などが趣味です。様々なことに触れながら、新しいことに積極的に挑戦することを心がけています。"
                />
            </p>
        );
    }

    return (
        <p lang={locale}>
            Outside of programming, I enjoy{" "}
            <span className={styles.baking}>
                <span className={styles.bakingInner}>
                    <BakingGallery />
                </span>
            </span>{" "}
            baking and{" "}
            <Link to="/photos" data-inline-link>
                photography
            </Link>
            , which I started after buying a camera recently. I try to stay curious across different fields and actively
            take on new challenges.
        </p>
    );
}
