---
slug: RaceAssist
title: RaceAssist
abstract: >-
  RaceAssistは、Minecraftサーバー上で競馬イベントを開催するために開発したプラグインです。
  レース開催、リアルタイム順位表示、ベッティング、外部連携API、フロントエンドによる情報表示をまとめて扱えるようにしました。
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
  alt: RaceAssist の競馬場
  blurhash: 'UYG]ds${%Nx^p3xcxss+Imt5RPMxoNjJt7t7'
openGraph:
  title: RaceAssist
  description: Minecraftサーバー上で競馬イベントを開催するためのレース支援プラグインです。
  image: ./assets/race-place.png
  imageAlt: RaceAssist の競馬場
---
image:
  src: ./assets/race-place.avif
  alt: RaceAssist の競馬場
  caption: RaceAssist を利用した競馬場
layout: left-image
---

## 制作背景

Minecraftサーバーで競馬イベントを開くには、コースの案内、参加者の管理、順位判定、運営スタッフ向けの操作などを人力で補う必要がありました。RaceAssistは、そうした運営負荷を下げ、Minecraft内で競馬をイベントとして成立させるために開発したプラグインです。

競馬を開催することでMinecraft内の馬に価値を持たせ、プレイヤー同士の交流が生まれる場を作ることも目的にしています。単発のミニゲームではなく、サーバーのイベントとして繰り返し使えるように、レース名や回数ごとの管理、コピーコマンドによる設定流用なども考慮しています。

配布ページでは、Minecraft内で競馬やその他のレースを開催できるPaper向けプラグインとして公開していました。対象バージョンや運営方法がサーバーごとに変わりやすいため、イベントのルールやコース構造をプラグイン側で一定の形に整理し、運営者が毎回ゼロから準備しなくてよい状態を目指しました。

---

## プラグイン本体

プラグイン本体はKotlinで実装し、Minecraftサーバー上でのレース開催、リアルタイム順位表示、参加者管理、ゲーム内アイテムを使った賭けなどを扱えるようにしました。

外部サービスやフロントエンドからレース情報に触れられるよう、Ktorを使ったAPIサーバーもプラグイン側に組み込んでいます。APIドキュメントでは `RaceAssistAPI` からベット、データ、馬、競馬場、レース、Web連携の各マネージャーを取得できる構造になっており、プラグイン内部の責務をイベント運営の単位に分けています。OpenAPI形式のドキュメントを用意することで、フロントエンドとの連携や開発時の確認をしやすくしています。

順位判定では、コース上の進行度をどう扱うかが重要でした。READMEでは、初期の設計として角度差を使って順位を求めるため、コースは一周し交差しない形である必要があることを明示しています。この制約を運用上の前提として扱いながら、将来的にはベクトルによる算出へ置き換える想定も残していました。

---
image:
  src: ./assets/frontend.avif
  alt: RaceAssist のフロントエンド画面
  caption: RaceAssist のフロントエンド
layout: right-image
---

## フロントエンド

フロントエンドでは、各馬の情報や競馬場の情報を表示し、参加者がイベントの状態を把握しやすくすることを目指しました。Minecraft内だけでは見えにくい情報をWeb側に整理して出すことで、運営者と参加者の両方がレースの状況を追いやすくなります。

UIにはMUIを利用し、管理画面としての見通しと、イベント中に必要な情報へ素早くアクセスできることを意識しました。

Minecraft内のコマンドだけで全てを完結させると、参加者の一覧や競馬場ごとの情報、開催中の状態を俯瞰しにくくなります。フロントエンドは、そうした運営者向けの確認画面としてだけでなく、イベントに参加するプレイヤーがレースの状況を理解するための補助画面としても位置づけています。

---

## 運用

言語ファイルを `plugins/RaceAssist/Lang` に配置することで翻訳を切り替えられるようにし、Crowdinで翻訳管理もできる構成にしています。サーバーイベント向けのプラグインは、開発者だけでなく運営スタッフや参加者にも触れられるため、コマンドや表示文言を調整しやすいことを重視しました。
