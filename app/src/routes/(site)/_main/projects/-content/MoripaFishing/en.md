---
slug: MoripaFishing
title: MoripaFishing
abstract: >-
  MoripaFishing is a Minecraft plugin that extends the fishing experience on a server.
  It lets administrators define custom fish, rarities, and catching conditions so the server can run its own collection loops and seasonal events.
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: Kotlin · Paper API · Gradle · Docusaurus
  - term: Year
    description: 2025 — Present
  - term: Status
    description: Active
  - term: Document
    description: fishing.plugin.morino.party
    href: https://fishing.plugin.morino.party/
    external: true
  - term: Source
    description: morinoparty/MoripaFishing
    href: https://github.com/morinoparty/MoripaFishing
    external: true
coverImage:
  src: ./assets/cover.png
  alt: Key visual for MoripaFishing features
openGraph:
  title: MoripaFishing
  description: A Minecraft fishing plugin with configurable fish, rarities, and condition-based catches.
  image: ./assets/cover.png
  imageAlt: Key visual for MoripaFishing features
---
image:
  src: ./assets/cover.png
  alt: Key visual for MoripaFishing features
  caption: MoripaFishing key visual
layout: left-image
---

## Background

Fishing is an easy activity for Minecraft players to join, but the vanilla mechanics are not enough when a server wants its own seasonal events or collection goals. MoripaFishing adds configurable fish definitions, rarity tiers, and catching conditions such as world, biome, weather, and time.

The goal is to turn fishing into a flexible server activity that can connect exploration, events, and community stories.

---

## Design

The project is split into `api` and `app` modules. The `api` module contains data structures and extension points for fish, rarities, and events. The `app` module handles configuration loading, fishing event processing, and administrator commands.

Fish and rarity definitions are handled as JSON configuration so server operators can tune the experience without changing code. The implementation also keeps future expansion in mind, such as player fishing records and integrations with other server systems.

---

## Documentation

Commands and configuration details are documented on the project site. Because Minecraft plugins are often operated by server administrators after installation, MoripaFishing keeps operational documentation separate from the source README.
