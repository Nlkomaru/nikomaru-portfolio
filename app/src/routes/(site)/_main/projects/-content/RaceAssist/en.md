---
slug: RaceAssist
title: RaceAssist
abstract: >-
  RaceAssist is a Minecraft plugin for running horse racing events on a server.
  It brings together race hosting, live ranking, betting, external APIs, and a frontend for displaying race information.
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: Kotlin · Ktor · Bukkit/Paper API · OpenAPI · MUI
  - term: Year
    description: 2021 — 2024
  - term: Status
    description: Maintained
  - term: Document
    description: RaceAssist API Docs
    href: https://raceassist.github.io/RaceAssist-core/-race-assist/dev.nikomaru.raceassist.api.core/-race-assist-a-p-i/index.html
    external: true
  - term: Source
    description: RaceAssist/RaceAssist-core
    href: https://github.com/RaceAssist/RaceAssist-core
    external: true
coverImage:
  src: ./assets/race-place.avif
  alt: RaceAssist race venue
  blurhash: 'UYG]ds${%Nx^p3xcxss+Imt5RPMxoNjJt7t7'
openGraph:
  title: RaceAssist
  description: A Minecraft plugin for running horse racing events on a server.
  image: ./assets/race-place.png
  imageAlt: RaceAssist race venue
---
image:
  src: ./assets/race-place.avif
  alt: RaceAssist race venue
  caption: RaceAssist race venue
layout: left-image
---

## Background

Running a horse racing event on a Minecraft server requires course guidance, participant management, ranking, and staff operations. RaceAssist was built to reduce that operational burden and make racing events work inside Minecraft.

The project also aims to give horses more value inside Minecraft and create more opportunities for players to interact through events. Rather than being a one-off mini-game, the plugin is designed around repeated server events. It supports workflows such as managing race names by event count and copying race settings for the next run.

The published plugin page describes RaceAssist as a Paper plugin for conducting horse races and other races within Minecraft. Because server versions, event rules, and course layouts can differ by community, the plugin tries to formalize the event flow so staff do not have to rebuild the operational setup from scratch every time.

---

## Backend

The plugin backend is implemented in Kotlin. It handles race hosting, live ranking display, participant management, and betting with valuable in-game items.

It also embeds an API server with Ktor so external services and the frontend can access race data. The generated API documentation exposes a `RaceAssistAPI` interface that provides managers for bets, data, horses, race venues, races, and web integration. This divides the plugin's responsibilities around the same concepts staff use while operating an event. OpenAPI documentation makes the integration easier to inspect and improves the development workflow between the plugin and frontend.

Ranking was one of the harder parts of the domain model. The README states that the early implementation used angle differences to determine order, which meant the race venue needed to be a non-intersecting loop. That constraint was documented as an operational assumption, while leaving room to replace the calculation with a vector-based approach later.

---
image:
  src: ./assets/frontend.avif
  alt: RaceAssist frontend
  caption: RaceAssist frontend
layout: right-image
---

## Frontend

The frontend displays horse information and race venue information so participants can understand the state of the event more easily. By presenting data that is hard to see only from inside Minecraft, the web interface helps both staff and participants follow the race.

The UI uses MUI to keep the administration screens visually consistent while making event-time information quick to access.

If every operation stays inside Minecraft commands, it becomes difficult to scan participants, venue data, and the current race state at once. The frontend is intended both as a staff-facing view for event operations and as a companion screen that helps participants understand what is happening during the race.

---

## Operations

Language files can be placed under `plugins/RaceAssist/Lang`, and translation management is supported through Crowdin. Because race plugins are used by staff and participants as well as developers, the project focuses on making commands and displayed text easier to operate during events.

The README also recommends creating a new race name for each event, using a naming pattern like `<race-name>_<count>`. The copy command can reuse settings while excluding event-specific data such as bets, staff, and entrants, reducing preparation work for repeated events.
