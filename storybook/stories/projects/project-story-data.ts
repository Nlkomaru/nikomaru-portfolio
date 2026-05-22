import type { Project } from "@/routes/(site)/_main/projects/-types/project";

export const mineAuthStoryProject: Project = {
    slug: "MineAuth",
    title: "MineAuth",
    abstract:
        "An OAuth 2 / OpenID Connect provider for Minecraft servers, designed so web applications and add-on plugins can safely reuse player identity.",
    metaItems: [
        {
            term: "Role",
            description: "Developer",
        },
        {
            term: "Stack",
            description: "Kotlin · Ktor · OpenTelemetry · Scalar",
        },
        {
            term: "Year",
            description: "2024 - Present",
        },
        {
            term: "Status",
            description: "Active",
        },
        {
            term: "Document",
            description: "mineauth.plugin.morino.party",
            href: "https://mineauth.plugin.morino.party",
            external: true,
        },
        {
            term: "Source",
            description: "github.com/morinoparty/mineauth",
            href: "https://github.com/morinoparty/mineauth",
            external: true,
        },
    ],
    coverImage: {
        src: "https://picsum.photos/seed/mineauth-community/1200/800",
        alt: "MineAuth Community",
    },
    openGraph: {
        title: "MineAuth",
        description: "An OAuth 2 / OpenID Connect provider for Minecraft servers.",
        image: "https://picsum.photos/seed/mineauth-community-og/1200/630",
        imageAlt: "MineAuth Community",
    },
};

export const projectCardStoryItems = [
    {
        slug: "MineAuth",
        title: "MineAuth",
        category: "Minecraft Plugin · Authorize",
        year: "2024 — Present",
        image: {
            src: "https://picsum.photos/seed/project-card-mineauth/1200/800",
            alt: "MineAuth project preview",
        },
    },
    {
        slug: "Chlorophyll",
        title: "Chlorophyll",
        category: "Design System",
        year: "2025 — Present",
        image: {
            src: "https://picsum.photos/seed/project-card-chlorophyll/1200/800",
            alt: "Chlorophyll project preview",
        },
    },
    {
        slug: "MoriPath",
        title: "MoriPath",
        category: "Web App",
        year: "2025 — Present",
        image: {
            src: "https://picsum.photos/seed/project-card-moripath/1200/800",
            alt: "MoriPath project preview",
        },
    },
    {
        slug: "RaceAssist",
        title: "RaceAssist",
        category: "Minecraft Plugin · Race",
        year: "2021 — 2024",
        image: {
            src: "https://picsum.photos/seed/project-card-raceassist/1200/800",
            alt: "RaceAssist project preview",
        },
    },
    {
        slug: "MineStamp",
        title: "MineStamp",
        category: "Minecraft Plugin · Emoji",
        year: "2023 — 2024",
        image: {
            src: "https://picsum.photos/seed/project-card-minestamp/1200/800",
            alt: "MineStamp project preview",
        },
    },
    {
        slug: "MoripaFishing",
        title: "MoripaFishing",
        category: "Minecraft Plugin · Fishing",
        year: "2025 — Present",
        image: {
            src: "https://picsum.photos/seed/project-card-moripafishing/1200/800",
            alt: "MoripaFishing project preview",
        },
    },
] as const;

export const markdownStoryContent = `
## Authentication platform

MineAuth provides [OAuth 2](https://oauth.net/2/) and [OpenID Connect](https://openid.net/developers/how-connect-works/) for Minecraft servers.

### Supported workflows

- Web application login
- Add-on plugin APIs
- Shared player identity

> The same renderer should keep prose, links, lists, quotes, tables, and images visually consistent.

| Capability | Status |
| --- | --- |
| Authorization code flow | Supported |
| Add-on API registration | Supported |

![MineAuth API documentation with Scalar](https://picsum.photos/seed/mineauth-scalar-md/960/540)
`;

export const textOnlySectionMarkdown = `
## Authentication platform

MineAuth turns the server into a reusable identity provider while keeping plugin data close to the game server.
`;

export const imageSectionMarkdown = `
## API documentation

Scalar exposes the generated API docs so add-on developers can inspect endpoints and authorize requests from the same workflow.
`;
