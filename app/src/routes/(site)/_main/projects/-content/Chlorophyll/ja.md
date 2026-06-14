---
slug: Chlorophyll
title: Chlorophyll
abstract: >-
  Chlorophyllは、[もりのパーティ](https://morino.party)向けに開発しているトークンベースのデザインシステムです。
  Panda CSS と Ark UI を土台に、Webプロダクトやドキュメントサイト全体で配色・タイポグラフィ・コンポーネントの見た目を揃えることを目的としています。
metaItems:
  - term: Role
    description: Developer・Designer
  - term: Stack
    description: React · TypeScript · Panda CSS · Ark UI
  - term: Year
    description: 2025 — Present
  - term: Status
    description: Active (WIP)
  - term: Document
    description: Chlorophyll Docs（Theme）
    href: https://chlorophyll-docs.nikomaru.workers.dev/docs/theme
    external: true
  - term: Source
    description: morinoparty/Chlorophyll
    href: https://github.com/morinoparty/chlorophyll
    external: true
coverImage:
  src: ./assets/sekaiju.png
  alt: Chlorophyll のテーマを想起させるキービジュアル
  blurhash: 'UbFi}t?w.8Mw%%tStRV?IWMwMxt7xwV?n~oz'
openGraph:
  title: Chlorophyll
  description: >-
    Morino Party 向けの Panda CSS / Ark UI ベースのデザインシステム。セマンティックトークンと UI コンポーネントでプロダクトの見た目を揃えます。
  image: ./assets/sekaiju.png
  imageAlt: Chlorophyll のテーマをイメージしたビジュアル（世界樹）
---
image:
  src: ./assets/MoripaApps.png
  alt: もりのパーティで運用中のサイトおよびアプリ
  caption: もりのパーティで運用中のサイトおよびアプリ
layout: left-image
---

## 制作背景

コミュニティ運営では、公式サイト・社内ツール・ドキュメントなど複数の画面が増えていく一方で、それぞれ別々のスタイルが混在しやすくなります。私が所属する[もりのパーティ](https://morino.party)でも、Webサイトやリニューアル中の公式Wiki、[Moripath](./MoriPath)と呼ばれるアプリケーションなどで、ブランドイメージを統一するために共通のトークンとコンポーネントを用意したいと考えていました。

そこで、[Panda CSS](https://panda-css.com/) でテーマとプリセットをまとめ、[Ark UI](https://ark-ui.com/) をヘッドレス層として React コンポーネントを組み立てる Chlorophyll を進めています。単なる UI キットではなく、**セマンティックトークン（System Tokens）が参照トークン（Reference Tokens）にマッピングされる**構造で、配色や余白・タイポグラフィの決め方をドキュメント化し、実装とデザインの共通言語にしたいと考えています。これにより、AIなどを利用したデザイン支援や、デザイナーとエンジニアのコラボレーションを促進していけると考えました。

---
image:
  src: ./assets/chlorophyll.avif
  alt: Chlorophyll のブランド画像
  caption: Chlorophyll のビジュアルアイデンティティ
layout: right-image
---

## デザイントークンとドキュメント

トークン設計の考え方は、[Chlorophyll の Theme ドキュメント](https://chlorophyll-docs.nikomaru.workers.dev/docs/theme)にまとめています。**System Tokens**（用途ベースのセマンティック値）と **Reference Tokens**（パレットやタイポの土台）に分け、コンポーネントからはまずセマンティック側を参照するイメージです。カラー・ボーダー・タイポグラフィ・z-index・シャドウ・角丸・スペーシング・アニメーションなど、カテゴリごとの説明もそこから辿れるようにしています。

チームで Panda のプリセットを配布し、各アプリの `styled-system` に取り込む、またはChlorophyll側で用意する予定のコンポーネントを活用した運用を想定しています。追加するコンポーネントについては、一般的なWebアプリケーションで使用されるボタンなど以外にも、Minecraftサーバー特有のコンポーネント(具体的にはプレイヤーのスキンの表示など)を考えています。

---
image:
  src: ./assets/storybook.avif
  alt: Chlorophyll の Storybook 画面
  caption: Storybook でのコンポーネント確認画面(APCAによるコントラストチェック)
layout: left-image
---

## UI品質検証とCI

コンポーネントの作成および評価のためにStorybookを使用しています。Storybookでは、[アクセシビリティテストのためのアドオン](https://storybook.js.org/docs/writing-tests/accessibility-testing)があり、axe-coreライブラリをベースに構築されています。Chlorophyllでは、axe-coreのcolor contrast checkを従来のWCAG 2.xベースの判定から[APCA（Accessible Perceptual Contrast Algorithm）](https://git.myndex.com/)へoverrideし、より知覚に近いコントラスト評価を行えるようにしています。

この検証はローカルのStorybook上での確認だけでなく、GitHub Actions上でも実行しています。CIではA11yテストに加えてVRT（Visual Regression Testing）も回し、コンポーネントやトークンを変更した際に、アクセシビリティと見た目の差分を継続的に評価できるようにしています。デザインシステムとして提供するUIの品質を保ちながら、変更の影響を確認しつつ改善できる体制を整えています。
