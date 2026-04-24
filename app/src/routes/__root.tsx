import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Link, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { sva } from "styled-system/css";

import { Navbar } from "../components/navbar";
import { Provider } from "../components/ui/provider";
import { m } from "../paraglide/messages";
import { getLocale } from "../paraglide/runtime";

import appCss from "../styles.css?url";

const rootDocumentStyles = sva({
    slots: ["content"],
    base: {
        content: {
            minH: "100vh",
            ml: { md: "14" },
        },
    },
});

const notFoundStyles = sva({
    slots: ["root", "section", "eyebrow", "title", "description", "linkWrap", "backLink"],
    base: {
        root: {
            minH: "100vh",
            bg: "bg.canvas",
            color: "fg.default",
            pt: { base: "14", md: "0" },
        },
        section: {
            display: "flex",
            minH: { base: "calc(100vh - 3.5rem)", md: "100vh" },
            flexDirection: "column",
            justifyContent: "center",
            gap: "6",
            px: { base: "8", md: "20" },
            py: { base: "12", md: "20" },
        },
        eyebrow: {
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.45em",
            color: "fg.muted",
        },
        title: {
            fontSize: { base: "2.5rem", md: "4.5rem" },
            lineHeight: 1,
        },
        description: {
            maxW: "lg",
            fontSize: "0.75rem",
            lineHeight: "8",
            color: "fg.subtle",
        },
        linkWrap: {
            pt: "4",
        },
        backLink: {
            display: "inline-flex",
            alignItems: "center",
            gap: "3",
            borderWidth: "1px",
            borderColor: "border.default",
            bg: "bg.default",
            px: "5",
            py: "3",
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "fg.default",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
            _hover: {
                bg: "bg.subtle",
                borderColor: "border.outline",
            },
        },
    },
});

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: m.metaSiteTitle(),
            },
            {
                name: "description",
                content: m.metaSiteDescription(),
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),
    shellComponent: RootDocument,
});

// Force child routes to re-mount on locale change so all m.*() messages update
function RootComponent() {
    useRouterState();
    const locale = getLocale();
    return <Outlet key={locale} />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
    const locale = getLocale();
    const styles = rootDocumentStyles();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <Provider>
                    <Navbar />
                    <div className={styles.content}>{children}</div>
                </Provider>
                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}

function NotFoundComponent() {
    const styles = notFoundStyles();

    return (
        <main className={styles.root}>
            <section className={styles.section}>
                <p className={styles.eyebrow}>Not Found</p>
                <h1 className={styles.title} style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300 }}>
                    This page doesn&apos;t exist.
                </h1>
                <p className={styles.description} style={{ fontFamily: '"Space Mono", monospace' }}>
                    The route may have moved, or it was never published. Return to the index and continue from there.
                </p>
                <div className={styles.linkWrap}>
                    <Link to="/" className={styles.backLink}>
                        Back To Index
                    </Link>
                </div>
            </section>
        </main>
    );
}
