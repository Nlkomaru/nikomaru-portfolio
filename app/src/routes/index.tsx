import { createFileRoute } from "@tanstack/react-router";

import StarPortfolioHero from "./-components/star-portfolio-hero";

export const Route = createFileRoute("/")({ component: App });

function App() {
    return <StarPortfolioHero />;
}
