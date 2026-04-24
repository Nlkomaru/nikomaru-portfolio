import { createFileRoute, Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { m } from "../paraglide/messages";
import { getLocale } from "../paraglide/runtime";
import { IntroP3 } from "./-components/intro-p3";

const appPageStyles = sva({
    slots: ["root", "greeting", "greetingText", "icon", "intro"],
    base: {
        root: {
            minH: "100vh",
            bg: "bg.canvas",
            px: { base: "8", md: "20" },
            display: "flex",
            flexDirection: "column",
            gap: "6",
            maxW: "4xl",
            mx: "auto",
            color: "fg.default",
            justifyContent: "center",
        },
        greeting: {
            display: "flex",
            flexDirection: "row",
            gap: "6",
            alignItems: "center",
        },
        greetingText: {
            fontSize: "3xl",
            fontWeight: "bold",
            color: "fg.default",
        },
        icon: {
            borderRadius: "full",
        },
        intro: {
            color: "fg.muted",
            display: "flex",
            flexDirection: "column",
            gap: "4",
        },
    },
});
export const Route = createFileRoute("/")({
    component: AppPage,
    headers: () => ({
        // Cache HTML at the edge to reduce TTFB on repeat visits.
        // Keep browser cache minimal to avoid stale locale-specific content.
        "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    }),
});

function AppPage() {
    const styles = appPageStyles();
    const locale = getLocale();

    return (
        <div className={styles.root}>
            <div className={styles.greeting}>
                <img
                    className={styles.icon}
                    src="https://avatars.githubusercontent.com/u/76208219?v=4"
                    alt="icon"
                    width={48}
                    height={48}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <p className={styles.greetingText}>{m["homeGreeting"]()}</p>
            </div>
            <div className={styles.intro}>
            <p>{m["top.introP1"]()}</p>
            <p>
                {locale === "ja" ? (
                    <>
                        認可認証やデザインシステムといった幅広い分野に興味があります。
                        <Link to="/projects/$project" params={{ project: "MineAuth" }} data-inline-link>
                            MineAuth
                        </Link>
                        というプロジェクトでは、OAuth2 / OpenID Connectおよび関連するAPI設計に取り組んでいます。また、
                        <Link to="/projects/$project" params={{ project: "MoriPath" }} data-inline-link>
                            MoriPath
                        </Link>
                        や
                        <Link to="/projects/$project" params={{ project: "Chlorophyll" }} data-inline-link>
                            Chlorophyll
                        </Link>
                        といったプロジェクトでは、モダンなWeb開発やUIの基盤、デザインシステムの探求を行っています。
                    </>
                ) : (
                    <>
                        I&apos;m especially interested in authentication and developer-facing systems. In{" "}
                        <Link to="/projects/$project" params={{ project: "MineAuth" }} data-inline-link>
                            MineAuth
                        </Link>
                        , I work on OAuth2 / OpenID Connect and related API design. I&apos;ve also built projects such
                        as{" "}
                        <Link to="/projects/$project" params={{ project: "MoriPath" }} data-inline-link>
                            MoriPath
                        </Link>{" "}
                        and{" "}
                        <Link to="/projects/$project" params={{ project: "Chlorophyll" }} data-inline-link>
                            Chlorophyll
                        </Link>
                        , where I explore modern web development, UI foundations, and design systems.
                    </>
                )}
            </p>
            <IntroP3 />
            </div>
        </div>
    );
}
