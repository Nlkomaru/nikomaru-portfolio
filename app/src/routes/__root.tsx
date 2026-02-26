import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import Header from "../components/header";
import { m } from "../paraglide/messages";
import { getLocale } from "../paraglide/runtime";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
    component: RootComponent,
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

    return (
        <html lang={locale}>
            <head>
                <HeadContent />
            </head>
            <body>
                <Header />
                {children}
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
