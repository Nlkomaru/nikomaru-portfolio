import { createFileRoute } from "@tanstack/react-router";
import { m } from "../paraglide/messages";

export const Route = createFileRoute("/")({ component: App });

function App() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-semibold">{m.homeGreeting()}</h1>
        </div>
    );
}
