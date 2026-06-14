---
slug: MoriPath
title: MoriPath
abstract: >-
  MoriPath is a web application being developed for the Morino Party Minecraft server.
  By integrating with MineAuth, it lets logged-in players check and operate on online status, donguri balances (in-game currency), protected blocks, quests, and other server data from outside the Minecraft server.
metaItems:
  - term: Role
    description: Developer · Designer (Partial)
  - term: Stack
    description: React · TypeScript · TanStack Start · Cloudflare Workers
  - term: Year
    description: 2025 — Present
  - term: Status
    description: Active (WIP)
  - term: Source
    description: morinoparty/MoriPath
    href: https://github.com/morinoparty/MoriPath
    external: true
coverImage:
  src: ./assets/app-showcase.avif
  alt: MoriPath screen design
  blurhash: 'UIKLpv?v4-00tlNF?IkV00xuiwD%~Xxa00IU'
openGraph:
  title: MoriPath
  description: A web application for the Morino Party Minecraft server that integrates with MineAuth to work with player information and server features.
  image: ./assets/app-showcase.png
  imageAlt: MoriPath screen design
---
image:
  src: ./assets/app-showcase.avif
  alt: MoriPath screen design
  caption: MoriPath screen design
layout: left-image
---

## Background

[Morino Party](https://morino.party), the community I belong to, has players with many different backgrounds. Some can play almost every day, while others cannot.
When players can access the server, they can check information such as their donguri balance (in-game currency) through commands or screens inside Minecraft. On the other hand, when they cannot launch Minecraft for a while, it becomes harder to see their own state or what is happening on the server, and I felt that their connection to the community could gradually fade.

MoriPath is a project being developed to keep the Minecraft server at the center while making the necessary information available from outside the server.
It brings together information players may want to check outside the server, such as online players, balances, protected blocks, and quests, and aims to let them stay aware of the community even when Minecraft is not running.

The "Path" in the name does not mean that every action should be completed inside this application alone. It expresses the idea of keeping the Minecraft server as the main place and providing a natural path from the web back to the server.

---
image:
  src: ./assets/mineauth-authorization.avif
  alt: MineAuth login screen
  caption: MineAuth login screen
layout: right-image
---

## Integration with MineAuth

MoriPath uses [MineAuth](./MineAuth) for authentication. MineAuth is treated as an OAuth 2/OpenID Connect provider, and MoriPath manages login state and access tokens through Better Auth's OIDC integration. This lets the web application safely access information for the authenticated Minecraft player.

After login, MoriPath retrieves player-specific information through MineAuth add-on APIs. For example, it calls data such as donguri balances through Vault integration, protected blocks through GriefPrevention integration, and daily quests through BetonQuest integration from server-side functions with an access token. By using MineAuth as the API foundation, it becomes easier to organize the responsibility of exposing Minecraft server data to the web.

---

## Application Design

The application is built around TanStack Start and Cloudflare Workers. Route loaders and server functions collect server information, while the UI displays cards for online status, player profiles, balances, and protected blocks. Frequently checked information is placed on the initial screen, and the structure is designed to make it easier to add future features such as maps, shops, and account-related functionality.

The UI is designed with smartphone usage in mind, and it is structured to connect not only with MoriPath's own screens but also with the token design being developed in [Chlorophyll](./Chlorophyll). Through Storybook, I review parts such as headers, navigation, notifications, and player displays while adjusting the balance between information density and ease of interaction for a Minecraft community application.
