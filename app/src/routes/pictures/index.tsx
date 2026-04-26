import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pictures/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/pictures/"!</div>;
}
