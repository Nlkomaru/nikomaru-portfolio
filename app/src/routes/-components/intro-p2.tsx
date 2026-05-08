import { Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { getLocale } from "../../paraglide/runtime";

const introP2Styles = sva({
    slots: ["noWrap"],
    base: {
        noWrap: {
            whiteSpace: "nowrap",
        },
    },
});

export function IntroP2() {
    const locale = getLocale();
    const styles = introP2Styles();
    const oauthLabel = <span className={styles.noWrap}>OAuth 2.0 / OpenID Connect</span>;

    if (locale === "ja") {
        return (
            <p lang={locale}>
                認可・認証やデザインシステムなど様々な分野に興味があり、特にアクセシビリティにも配慮したUIや体験づくりを探求しています。
                <span className={styles.noWrap}>
                    <Link to="/projects/$project" params={{ project: "MineAuth" }} data-inline-link>
                        MineAuth
                    </Link>
                    では
                </span>
                {oauthLabel}
                をはじめとする認証基盤やAPI設計に取り組み、
                <Link to="/projects/$project" params={{ project: "MoriPath" }} data-inline-link>
                    MoriPath
                </Link>
                や
                <Link to="/projects/$project" params={{ project: "Chlorophyll" }} data-inline-link>
                    Chlorophyll
                </Link>
                ではモダンなWeb開発やUIの基盤づくりを進めています。
            </p>
        );
    }

    return (
        <p lang={locale}>
            I&apos;m interested in auth, design systems, and accessible UI. In{" "}
            <Link to="/projects/$project" params={{ project: "MineAuth" }} data-inline-link>
                MineAuth
            </Link>
            , I work on {oauthLabel}, auth infrastructure, and API design. In{" "}
            <Link to="/projects/$project" params={{ project: "MoriPath" }} data-inline-link>
                MoriPath
            </Link>{" "}
            and{" "}
            <Link to="/projects/$project" params={{ project: "Chlorophyll" }} data-inline-link>
                Chlorophyll
            </Link>
            , I&apos;m building foundations for modern web development and UI.
        </p>
    );
}
