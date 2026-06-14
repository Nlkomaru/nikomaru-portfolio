---
slug: MoripaFishing
title: MoripaFishing
abstract: >-
  MoripaFishingは、Minecraftサーバー上の釣り体験を拡張するために開発しているプラグインです。
  管理者が魚・レアリティ・釣れる条件を定義できるようにし、サーバー独自の収集要素やイベント運用を作りやすくすることを目指しています。
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
  src: ./assets/cover.jpg
  alt: MoripaFishing の機能を想起させるキービジュアル
  blurhash: 'UKC%.[PfDgInIzq|Vqr=lotQR2NF?cM{sjbt'
openGraph:
  title: MoripaFishing
  description: Minecraftサーバー向けに、魚・レアリティ・条件判定を設定できる釣り拡張プラグインです。
  image: ./assets/cover.jpg
  imageAlt: MoripaFishing の機能を想起させるキービジュアル
---
image:
  src: ./assets/cover.jpg
  alt: MoripaFishing の機能を想起させるキービジュアル
  caption: MoripaFishing のキービジュアル
layout: left-image
---

## 制作背景

Minecraftサーバーの釣りは、プレイヤーが気軽に参加できる一方で、標準の仕組みだけではサーバー独自のイベントやコレクション要素を作り込みにくいと感じていました。MoripaFishingは、魚の種類や説明、レアリティ、釣れるワールド・バイオーム・天候・時間帯などを設定できるようにし、サーバーごとの遊びを増やすために開発しているプラグインです。

釣りを単なるランダム報酬ではなく、探索やイベントと接続できる仕組みにすることで、Minecraft内の生活感やコミュニティの話題を増やせるようにしています。

---

## 設計

プロジェクトは `api` と `app` のモジュールに分けています。`api` には魚・レアリティ・イベントなどのデータ構造と拡張用インターフェースを置き、他のプラグインからMoripaFishingの機能へ接続しやすくしています。`app` 側では設定ファイルの読み込み、釣りイベントの処理、管理者向けコマンドを扱います。

魚やレアリティの定義はJSON設定として扱い、サーバー運営者がコードを書かずに調整できる構成にしています。将来的にプレイヤーごとの釣果記録やイベント集計と接続できるよう、釣り結果を単発の処理で終わらせず、履歴やAPIに展開しやすい形で扱うことを意識しています。
