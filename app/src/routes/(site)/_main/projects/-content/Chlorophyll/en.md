---
slug: Chlorophyll
title: Chlorophyll
abstract: >-
  Chlorophyll is a token-based design system for [Morino Party](https://morino.party).
  Built on Panda CSS and Ark UI, it aligns colors, typography, and components across web products and documentation sites.
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: React · TypeScript · Panda CSS · Ark UI
  - term: Year
    description: 2025 — Present
  - term: Status
    description: Active (WIP)
  - term: Document
    description: Chlorophyll Docs (Theme)
    href: https://chlorophyll-docs.nikomaru.workers.dev/docs/theme
    external: true
  - term: Source
    description: morinoparty/Chlorophyll
    href: https://github.com/morinoparty/chlorophyll
    external: true
coverImage:
  src: ./assets/chlorophyll.avif
  alt: Chlorophyll brand visual
openGraph:
  title: Chlorophyll
  description: >-
    A Panda CSS and Ark UI based design system for Morino Party. Semantic tokens and UI components keep product UI consistent.
  image: ./assets/sekaiju.png
  imageAlt: Chlorophyll theme-inspired visual (world tree motif)
---
image:
  src: ./assets/chlorophyll.avif
  alt: Chlorophyll brand artwork
  caption: Chlorophyll visual identity
layout: left-image
---

## Background

Community-driven teams tend to accumulate many surfaces—sites, internal tools, docs—and styles drift apart. At [Morino Party](https://morino.party), Minecraft-related tools and web content kept growing, so we wanted **shared tokens and components** with solid accessibility and maintainability.

Chlorophyll uses [Panda CSS](https://panda-css.com/) for themes and presets and [Ark UI](https://ark-ui.com/) as the headless layer for React. Rather than a loose UI kit, it treats **semantic system tokens mapped from reference tokens** as the contract between design and code, documented so implementation stays aligned.

---

## Design tokens and documentation

The token model is explained in the [Theme section of the Chlorophyll docs](https://chlorophyll-docs.nikomaru.workers.dev/docs/theme): **System Tokens** (semantic, intent-based) sit on top of **Reference Tokens** (palette, type scale, etc.). Components consume semantics first. Categories include colors, borders, typography, z-index, shadows, radii, spacing, and animation.

We publish Panda presets for consumers to pull into each app’s `styled-system`. The docs site runs on Cloudflare Workers so the same reference stays browsable alongside the codebase.

---
image:
  src: ./assets/sekaiju.png
  alt: Visual suggesting Chlorophyll theme tokens
  caption: Key visual used for sharing and Open Graph previews
layout: right-image
---

## Components and repository

Packages such as `@moripa/chlorophyll` expose components; [Storybook](https://github.com/morinoparty/chlorophyll/tree/main/storybook) supports review and testing (see the [GitHub repository](https://github.com/morinoparty/chlorophyll)). The project is explicitly **work in progress**, with presets, components, and docs evolving together.

Issues and sources stay public so Morino Party products—and anyone on a similar stack—can reuse or fork the approach.
