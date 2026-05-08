import { Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { getLocale } from "../../paraglide/runtime";
import { IntroBudouxText } from "./intro-budoux-text";

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
                <IntroBudouxText
                    locale={locale}
                    text="認可・認証やデザインシステムなど様々な分野に興味があり、特にアクセシビリティにも配慮したUIや体験づくりを探求しています。"
                />
                <Link to="/projects/$project" params={{ project: "MineAuth" }} data-inline-link>
                    MineAuth
                </Link>
                <IntroBudouxText locale={locale} text="では" />
                {oauthLabel}
                <IntroBudouxText locale={locale} text="をはじめとする認証基盤やAPI設計に取り組み、" />
                <Link to="/projects/$project" params={{ project: "MoriPath" }} data-inline-link>
                    MoriPath
                </Link>
                <IntroBudouxText locale={locale} text="や" />
                <Link to="/projects/$project" params={{ project: "Chlorophyll" }} data-inline-link>
                    Chlorophyll
                </Link>
                <IntroBudouxText locale={locale} text="ではモダンなWeb開発やUIの基盤づくりを進めています。" />
            </p>
        );
    }

    return (
        <p lang={locale}>
            I&apos;m interested in a wide range of areas, including authorization, authentication, and design systems,
            and I&apos;m especially exploring UI and experience design with accessibility in mind. In{" "}
            <Link to="/projects/$project" params={{ project: "MineAuth" }} data-inline-link>
                MineAuth
            </Link>
            , I work on authentication infrastructure, including {oauthLabel}, and API design. In{" "}
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
