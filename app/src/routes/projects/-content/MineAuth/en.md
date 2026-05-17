---
slug: MineAuth
title: MineAuth
abstract: >-
  MineAuth is a plugin that provides an OAuth 2/OpenID Connect authentication platform running on a Minecraft server.
  It was built so web applications and external services can safely work with player data already managed by server-side plugins and systems.
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: Kotlin · Ktor · OpenTelemetry · Scalar
  - term: Year
    description: 2024 — Present
  - term: Status
    description: Active
  - term: Document
    description: https://mineauth.plugin.morino.party
    href: https://mineauth.plugin.morino.party
    external: true
  - term: Source
    description: https://github.com/morinoparty/mineauth
    href: https://github.com/morinoparty/mineauth
    external: true
coverImage:
  src: /projects/mineauth/community.avif
  alt: MineAuth Community
openGraph:
  title: MineAuth
  description: MineAuth is a plugin that provides an OAuth 2/OpenID Connect authentication platform running on a Minecraft server.
  image: /projects/mineauth/community.png
  imageAlt: MineAuth Community
---
image:
  src: /projects/mineauth/moripath.avif
  alt: MoriPath
  caption: Screenshot of MoriPath
layout: left-image
---

## Background

MineAuth was developed to introduce SSO to a Minecraft server and let web applications and external services handle player data safely.
[Morino Party](https://morino.party), the community I belong to, operates a Minecraft server along with a website, an official wiki, and a user-facing application called [MoriPath](/projects/MoriPath) that is still under development. MoriPath needed an API that could expose user-specific information for viewing and operation from the application. I also expected player identity to be useful for future wiki administration, such as tracking which server member wrote or edited a page. Those needs led me to build MineAuth as a shared authentication platform with single sign-on.

---

## Authentication Platform

I also considered established solutions such as [Keycloak](https://www.keycloak.org/) and [Ory Hydra](https://www.ory.com/hydra). They are reliable options with proven security records as OIDC providers. However, when integrating them with a Minecraft server, they would require operating separate servers or external databases and connecting them back to Minecraft-specific player data, which made the overall architecture more complex. MineAuth keeps the ideas of existing authentication platforms while running directly as a Minecraft plugin, allowing it to work closely with player information and permissions already present on the server.

---
image:
  src: /projects/mineauth/scalar.avif
  alt: MineAuth API documentation with Scalar.
  caption: API documentation generated with Scalar
layout: right-image
---

## Extensibility

MineAuth is designed not only for authentication, but also as a platform that lets external plugins add APIs as add-ons. Other plugins can register API endpoints with MineAuth and expose their own data or operations through MineAuth's authentication and authorization flow. This removes the need for every plugin to implement its own authentication layer and lets the Minecraft server use MineAuth as a shared API foundation. Scalar makes the added endpoints easier to inspect through generated API documentation, while OpenTelemetry tracing helps follow API requests and internal processing. The project brings together SSO, OIDC, an extensible API platform, and observability in the context of a Minecraft plugin.
