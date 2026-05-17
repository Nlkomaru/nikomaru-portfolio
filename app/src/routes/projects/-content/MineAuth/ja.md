---
slug: MineAuth
title: MineAuth
abstract: >-
  MineAuthは、マインクラフトサーバー上で動作するOAuth 2/OpenID Connectの認証基盤を提供するプラグインです。
  各種プラグインやサーバー側で持っているプレイヤー情報をもとに、Webアプリケーションや外部サービスからプレイヤーデータを安全に扱えるようにするために開発したプラグインです。
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: Kotlin · Ktor · OpenTelemetry · Scalar
  - term: Year
    description: 2024 — Present
  - term: Status
    description: Active
  - term: Document
    description: https://mineauth.plugin.morino.party
    href: https://mineauth.plugin.morino.party
    external: true
  - term: Source
    description: https://github.com/morinoparty/mineauth
    href: https://github.com/morinoparty/mineauth
    external: true
coverImage:
  src: /projects/mineauth/community.avif
  alt: MineAuth Community
openGraph:
  title: MineAuth
  description: MineAuthは、マインクラフトサーバー上で動作するOAuth 2/OpenID Connectの認証基盤を提供するプラグインです。
  image: /projects/mineauth/community.png
  imageAlt: MineAuth Community
---
image: 
  src: /projects/mineauth/moripath.avif
  alt: MoriPath
  caption: MoriPathのスクリーンショット
layout: left-image
---

## 制作背景

MineAuth は、MinecraftサーバーにSSOを導入し、Webアプリケーションや外部サービスからプレイヤーデータを安全に扱えるようにするために開発したプラグインです。
私の所属する[もりのパーティ](https://morino.party)では、Minecraftサーバーを運用しており、それに付随するWebサイトや公式Wiki、また作成中ではありますが[MoriPath](/projects/MoriPath)と呼ばれるユーザー向けのアプリケーションを開発・運用しています。MoriPathでは、ユーザーそれぞれの情報をアプリケーション上で閲覧、操作するために、外部からアクセスできるAPIを提供する必要がありました。また、構想段階ではありましたが、Wikiなどの管理画面においても、サーバーに参加しているどのプレイヤーが記述したのか、編集したのかを管理するために、プレイヤーの認証情報があると便利だと考えていました。そのため、シングルサインオンの仕組みを持つ認証基盤が必要だと考え、MineAuthを開発しました。


---

## 認証基盤

認証基盤としては [Keycloak](https://www.keycloak.org/) や [Ory Hydra](https://www.ory.com/hydra) なども検討しました。これらはセキュリティ面で実績があり、OIDCプロバイダとして信頼性の高い選択肢です。一方で、Minecraftサーバーと連携する場合には、別サーバーや外部データベースの運用、Minecraft固有のプレイヤーデータとの接続が必要になり、構成が複雑になりやすいと感じました。MineAuthでは、既存の認証基盤を参考にしつつ、Minecraftプラグインとしてサーバー内で動作する形にすることで、プレイヤー情報や権限と直接連携できる構成にしました。

---
image: 
  src: /projects/mineauth/scalar.avif
  alt: MineAuth API documentation with Scalar.
  caption: ScalarによるAPIドキュメント
layout: right-image
---

## 拡張性

また、MineAuthは認証だけでなく、外部プラグインがアドオンとしてAPIを追加できる基盤としても設計しています。他のプラグインはMineAuthにAPIエンドポイントを登録でき、自分のプラグインが持つデータや操作を、MineAuthの認証・認可を通して外部に公開できます。これにより、各プラグインが個別に認証機能を実装する必要がなくなり、Minecraftサーバー全体のAPI基盤として利用できます。さらに、ScalarによるAPIドキュメントで追加されたエンドポイントを確認しやすくし、OpenTelemetryによるトレーシングでAPIリクエストや内部処理の流れも追えるようにしました。Minecraftプラグインに、SSO・OIDC・拡張可能なAPI基盤・Observabilityの考え方を取り入れたプロジェクトです。
