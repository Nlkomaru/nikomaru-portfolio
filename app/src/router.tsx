import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { deLocalizeUrl, isLocale, localizeUrl } from "./paraglide/runtime";
import { routeTree } from "./routeTree.gen";
import "./i18n/paraglide-setup";

export function getRouter() {
    const router = createTanStackRouter({
        routeTree,
        rewrite: {
            input: ({ url }) => deLocalizeUrl(url),
            output: ({ url }) => {
                const localeOverride = url.searchParams.get("__locale");

                if (localeOverride && isLocale(localeOverride)) {
                    const urlWithoutOverride = new URL(url);
                    urlWithoutOverride.searchParams.delete("__locale");
                    return localizeUrl(urlWithoutOverride, { locale: localeOverride });
                }

                return localizeUrl(url);
            },
        },

        scrollRestoration: true,
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
