---
slug: MoriPath
title: MoriPath
abstract: >-
  MoriPathは、もりのパーティのMinecraftサーバー向けに開発しているポータルWebアプリケーションです。
  MineAuthと連携し、ログインしたプレイヤーがオンライン状況・どんぐり残高・保護ブロック・クエストなどをWebから確認、操作できるようにするために制作しています。
metaItems:
  - term: Role
    description: Developer・Designer
  - term: Stack
    description: React · TypeScript · TanStack Start · Better Auth · Cloudflare Workers
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
  alt: MoriPath の画面デザイン
openGraph:
  title: MoriPath
  description: もりのパーティのMinecraftサーバー向けに、MineAuthと連携してプレイヤー情報やサーバー機能を扱うポータルWebアプリケーションです。
  image: ./assets/app-showcase.png
  imageAlt: MoriPath の画面デザイン
---
image:
  src: ./assets/app-showcase.avif
  alt: MoriPath の画面デザイン
  caption: MoriPath の画面デザイン
layout: left-image
---

## 制作背景

私の所属する[もりのパーティ](https://morino.party)では、Minecraftサーバーを中心に、公式サイト・Wiki・認証基盤・各種プラグインなど複数の仕組みを運用しています。サーバー内で確認できる情報は多い一方で、プレイヤーが自分の状態やサーバーの状況を確認するためには、Minecraft内のコマンドや個別の画面に頼る必要がありました。

MoriPathは、そうした情報への「入口」をWebアプリケーションとしてまとめるために開発しているプロジェクトです。オンラインプレイヤー、残高、保護ブロック、クエストなど、サーバーの外から見たい情報をひとつのポータルで扱えるようにし、Minecraftを起動していない状態でもコミュニティの状況にアクセスできる体験を目指しています。

---
image:
  src: ./assets/mineauth-authorization.avif
  alt: MineAuthのログイン画面
  caption: MineAuthのログイン画面
layout: right-image
---

## MineAuthとの連携

MoriPathでは、認証に[MineAuth](./MineAuth)を利用しています。MineAuthをOAuth 2/OpenID Connectプロバイダーとして扱い、MoriPath側ではBetter AuthのOAuth連携を通してログイン状態とアクセストークンを管理しています。これにより、WebアプリケーションからMinecraftプレイヤー本人の情報へ安全にアクセスできます。

ログイン後は、MineAuthのアドオンAPIを通してプレイヤーごとの情報を取得します。たとえば、Vault連携によるどんぐり残高、GriefPrevention連携による保護ブロック、BetonQuest連携によるデイリークエストなどを、サーバーサイドの関数からアクセストークン付きで呼び出す構成です。MineAuth側をAPI基盤にすることで、MinecraftサーバーのデータをWebに公開する責務を整理しやすくしています。

---

## アプリケーション設計

アプリケーションはTanStack StartとCloudflare Workersを前提に構成しています。ルートのloaderやserver functionでサーバー情報を集め、画面側ではオンライン状況、プレイヤーのプロフィール、残高や保護ブロックのカードを表示します。プレイヤーがよく確認する情報を最初の画面に寄せ、将来的に地図・ショップ・アカウント関連の機能を追加しやすいポータルとして設計しています。

UIはスマートフォンからの利用を意識し、MoriPath単体の画面だけでなく[Chlorophyll](./Chlorophyll)で進めているトークン設計とも接続しやすい構成にしています。Storybookでヘッダー、ナビゲーション、通知、プレイヤー表示などの部品を確認しながら、Minecraftコミュニティ向けのアプリとして情報量と触りやすさのバランスを調整しています。
