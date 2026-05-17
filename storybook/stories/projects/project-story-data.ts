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
        src: "/projects/mineauth/community.png",
        alt: "MineAuth Community",
    },
};

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

![MineAuth API documentation with Scalar](/projects/mineauth/scalar.png)
`;

export const textOnlySectionMarkdown = `
## Authentication platform

MineAuth turns the server into a reusable identity provider while keeping plugin data close to the game server.
`;

export const imageSectionMarkdown = `
## API documentation

Scalar exposes the generated API docs so add-on developers can inspect endpoints and authorize requests from the same workflow.
`;
