import { createFileRoute } from "@tanstack/react-router";

import StarPortfolio from "./-components/star-portfolio";

export const Route = createFileRoute("/")({ component: App });

function App() {
    return <StarPortfolio />;
}
