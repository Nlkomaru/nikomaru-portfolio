---
slug: Chlorophyll
title: Chlorophyll
abstract: >-
  Chlorophyll is a token-based design system for [Morino Party](https://morino.party).
  Built on Panda CSS and Ark UI, it aligns colors, typography, and components across web products and documentation sites.
metaItems:
  - term: Role
    description: Developer · Designer
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
  src: ./assets/sekaiju.png
  alt: Key visual evoking the Chlorophyll theme
  blurhash: 'UbFi}t?w.8Mw%%tStRV?IWMwMxt7xwV?n~oz'
openGraph:
  title: Chlorophyll
  description: >-
    A Panda CSS and Ark UI based design system for Morino Party. Semantic tokens and UI components keep product UI consistent.
  image: ./assets/sekaiju.png
  imageAlt: Chlorophyll theme-inspired visual (world tree motif)
---
image:
  src: ./assets/MoripaApps.png
  alt: Sites and applications operated by Morino Party
  caption: Sites and applications operated by Morino Party
layout: left-image
---

## Background

Community operations tend to accumulate many surfaces, including official websites, internal tools, and documentation. As those surfaces grow, their visual styles can easily drift apart. At [Morino Party](https://morino.party), I wanted to prepare shared tokens and components to keep the brand experience consistent across the website, the official wiki under renewal, and an application called [MoriPath](./MoriPath).

Chlorophyll uses [Panda CSS](https://panda-css.com/) for themes and presets and [Ark UI](https://ark-ui.com/) as the headless layer for React components. Rather than treating it as a simple UI kit, I am designing it around **System Tokens mapped to Reference Tokens**, documenting decisions around color, spacing, and typography as a shared language between design and implementation. I also believe this structure can support AI-assisted design work and promote collaboration between designers and engineers.

---
image:
  src: ./assets/chlorophyll.avif
  alt: Chlorophyll brand image
  caption: Chlorophyll visual identity
layout: right-image
---

## Design tokens and documentation

The token model is explained in the [Theme section of the Chlorophyll docs](https://chlorophyll-docs.nikomaru.workers.dev/docs/theme). **System Tokens** are purpose-based semantic values, while **Reference Tokens** define the underlying palette and typography foundation. Components are intended to reference the semantic layer first. The documentation also covers categories such as colors, borders, typography, z-index, shadows, radii, spacing, and animation.

The intended workflow is to distribute Panda presets within the team so each application can import them into its `styled-system`, or use components planned for Chlorophyll itself. In addition to common web application components such as buttons, I am also considering Minecraft server-specific components, such as UI for displaying player skins.

---
image:
  src: ./assets/storybook.avif
  alt: Chlorophyll Storybook screen
  caption: Component review in Storybook with APCA-based contrast checking
layout: left-image
---

## UI Quality Validation and CI

Storybook is used for creating and evaluating components. Storybook provides an [accessibility testing addon](https://storybook.js.org/docs/writing-tests/accessibility-testing), which is built on top of axe-core. In Chlorophyll, the axe-core color contrast check is overridden from the conventional WCAG 2.x-based evaluation to [APCA (Accessible Perceptual Contrast Algorithm)](https://git.myndex.com/), allowing contrast to be evaluated in a way that is closer to human perception.

This validation is not limited to local Storybook review; it also runs in GitHub Actions. In CI, A11y tests and VRT (Visual Regression Testing) are both executed so changes to components or tokens can be continuously evaluated for accessibility and visual differences. This provides a workflow for improving the design system while checking the impact of changes and maintaining the quality of the UI it provides.
