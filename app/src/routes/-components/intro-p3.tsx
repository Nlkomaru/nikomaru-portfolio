import { sva } from "styled-system/css";
import { getLocale } from "../../paraglide/runtime";
import { Baking } from "./baking";
import { Link } from "@tanstack/react-router";

const introP3Styles = sva({
    slots: ["baking"],
    base: {
        baking: {
            display: "inline-block",
            verticalAlign: "middle",
            mr: "2",
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
                    <Baking />
                </span>
                お菓子作りや、最近カメラを購入したことをきっかけに始めた
                <Link to="/pictures" data-inline-link>
                    写真撮影
                </Link>
                などが趣味です。丁寧にものをつくること、試行錯誤しながら学ぶこと、そして技術と創作の両方に喜びを見いだすことを大切にしています。
            </p>
        );
    }

    return (
        <p>
            When I&apos;m not coding, I&apos;m usually{" "}
            <span className={styles.baking}>
                <Baking />
            </span>
            baking or <Link to="/pictures" data-inline-link>taking photos</Link>
            . I started photography after buying a camera recently, and I enjoy creating things with care—learning
            through trial and error along the way.
        </p>
    );
}
