---
slug: MineStamp
title: MineStamp
abstract: >-
  MineStampは、Minecraft内のプレイヤーの頭上に絵文字を表示するために開発したプラグインです。
  Unicode絵文字、多言語表示、S3・MinIO・R2などのオブジェクトストレージを使ったマルチサーバー同期に対応しています。
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
  alt: MineStamp でプレイヤーの頭上に絵文字を表示している画面
  blurhash: 'ULDvvLx{E1MwS,S*o#M^%jbeM_ocXBo2oHoc'
openGraph:
  title: MineStamp
  description: Minecraft内のプレイヤーの頭上にUnicode絵文字を表示するためのプラグインです。
  image: ./assets/player-with-emoji.png
  imageAlt: MineStamp でプレイヤーの頭上に絵文字を表示している画面
---
image:
  src: ./assets/player-with-emoji.avif
  alt: MineStamp でプレイヤーの頭上に絵文字を表示している画面
  caption: MineStamp の絵文字表示
layout: right-image
---

## 制作背景

Minecraftサーバー内のコミュニケーションはチャットやアクションに寄りがちですが、短い感情表現を視覚的に出せると、近くにいるプレイヤー同士のやり取りが少し豊かになります。MineStampは、Unicode絵文字をプレイヤーの頭上に表示し、サーバー内で軽いリアクションを共有できるようにするために開発しました。

絵文字は多くのプレイヤーにとってすでに馴染みのある表現なので、コマンドやGUIの学習コストを抑えながら、Minecraft内の会話に小さな演出を足せることを狙っています。チャットログではなくプレイヤーの位置に紐づいて表示されるため、誰がどの場面で反応しているのかが伝わりやすくなります。

実際の表示では、プレイヤーの頭上に絵文字がスタンプのように現れます。チャットログだけでは伝わりにくい感情表現を、プレイヤーの位置や場面と結びつけて見せられるところがMineStampの特徴です。例えば近くにいるプレイヤーへの返答や、スクリーンショットに残したい小さなリアクションを、会話の流れを止めずに表現できます。

---

## 実装と運用

MineStampではProtocolLibを利用し、Minecraftクライアントに見える表示を制御しています。ほぼすべてのUnicode絵文字を扱えるようにし、`en_US` と `ja_JP` の多言語表示にも対応しました。

また、複数サーバー構成で同じスタンプデータを扱えるよう、S3・MinIO・Cloudflare R2などのオブジェクトストレージを利用した同期をサポートしています。単一サーバーの装飾機能で終わらせず、ネットワーク型のMinecraftサーバーでも扱いやすいことを意識したプラグインです。

絵文字を扱う機能は表示崩れやフォント差分の影響を受けやすいため、単に文字列を出すだけではなく、Minecraftの描画上で読みやすく見えることを重視しました。サーバーごとに運用形態が異なることも踏まえ、単体サーバーでも複数サーバーでも同じ体験に近づけられるようにしています。
