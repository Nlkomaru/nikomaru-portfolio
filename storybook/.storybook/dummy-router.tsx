import type { Decorator } from "@storybook/react-vite";
import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
    RouterProvider,
} from "@tanstack/react-router";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { Provider } from "@/components/ui/provider";

const StoryContext = createContext<(() => ReactNode) | null>(null);

function StoryRouteRenderer() {
    const story = useContext(StoryContext);
    if (!story) {
        throw new Error("Story context is not available.");
    }

    return story();
}

const rootRoute = createRootRoute();
const supportedPaths = ["/", "/slides", "/talks", "/about", "/contact", "/projects", "/pictures", "/slide/$"] as const;
const childRoutes = supportedPaths.map((path) =>
    createRoute({
        getParentRoute: () => rootRoute,
        path,
        component: StoryRouteRenderer,
    }),
);
const routeTree = rootRoute.addChildren(childRoutes);

export function withDummyRouter(initialPath: (typeof supportedPaths)[number] = "/"): Decorator {
    return (Story) => {
        const router = useMemo(
            () =>
                createRouter({
                    routeTree,
                    history: createMemoryHistory({ initialEntries: [initialPath] }),
                }),
            [],
        );

        return (
            <Provider>
                <StoryContext.Provider value={Story}>
                    <RouterProvider router={router} />
                </StoryContext.Provider>
            </Provider>
        );
    };
}
