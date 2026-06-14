---
slug: MineStamp
title: MineStamp
abstract: >-
  MineStamp is a Minecraft plugin that displays emoji stamps above players.
  It supports Unicode emoji, multilingual messages, and multi-server synchronization through object storage such as S3, MinIO, and Cloudflare R2.
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: Kotlin · Paper API · ProtocolLib · Object Storage
  - term: Year
    description: 2023 — 2024
  - term: Status
    description: Released
  - term: Document
    description: minestamp.plugin.nikomaru.page
    href: https://minestamp.plugin.nikomaru.page
    external: true
  - term: Source
    description: Nlkomaru/MineStamp
    href: https://github.com/Nlkomaru/MineStamp
    external: true
coverImage:
  src: ./assets/player-with-emoji.avif
  alt: MineStamp displaying emoji above a player
  blurhash: 'ULDvvLx{E1MwS,S*o#M^%jbeM_ocXBo2oHoc'
openGraph:
  title: MineStamp
  description: A Minecraft plugin for displaying Unicode emoji stamps above players.
  image: ./assets/player-with-emoji.png
  imageAlt: MineStamp displaying emoji above a player
---
image:
  src: ./assets/player-with-emoji.avif
  alt: MineStamp displaying emoji above a player
  caption: MineStamp emoji display
layout: right-image
---

## Background

Communication on a Minecraft server often happens through chat and player actions, but a small visual reaction can make nearby interactions feel more expressive. MineStamp was built to display Unicode emoji above players so they can share lightweight reactions in the world.

Emoji are already familiar to many players, so the feature can add expression without forcing users to learn a large command or GUI system. Because the reaction appears above the player instead of only in chat, it is easier to understand who is reacting and what moment they are reacting to.

In-game, the emoji appears like a stamp above the player. MineStamp is strongest when the reaction is connected to the player's position and the moment in-game, instead of being limited to a chat log. It can be used for quick replies to nearby players or as a small visual reaction that remains understandable in screenshots and shared moments.

---

## Implementation and operations

MineStamp uses ProtocolLib to control the visual display seen by Minecraft clients. It supports almost all Unicode emoji and includes multilingual messages for `en_US` and `ja_JP`.

The plugin also supports multi-server setups through object storage such as S3, MinIO, and Cloudflare R2. This makes the stamp data usable across a networked Minecraft environment rather than only on a single server.

Emoji rendering is sensitive to font differences and visual layout, so the implementation is not only about sending a string to the client. The goal is to make the stamp readable in Minecraft's actual rendering context while keeping the same experience available across both single-server and networked server setups.
