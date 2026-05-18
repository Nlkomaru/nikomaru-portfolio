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
  src: ./assets/community.avif
  alt: MineAuth Community
openGraph:
  title: MineAuth
  description: MineAuthは、マインクラフトサーバー上で動作するOAuth 2/OpenID Connectの認証基盤を提供するプラグインです。
  image: ./assets/community.png
  imageAlt: MineAuth Community
---
image: 
  src: ./assets/moripath.avif
  alt: MoriPath
  caption: MoriPathのスクリーンショット
layout: left-image
---

## 制作背景

MineAuth は、MinecraftサーバーにSSOを導入し、Webアプリケーションや外部サービスからプレイヤーデータを安全に扱えるようにするために開発したプラグインです。

私の所属する[もりのパーティ](https://morino.party)では、Minecraftサーバーを運用しており、それに付随するWebサイトや公式Wiki、また作成中ではありますが[MoriPath](/projects/MoriPath)と呼ばれるユーザー向けのアプリケーションを開発・運用しています。MoriPathでは、ユーザーそれぞれの情報をアプリケーション上で閲覧、操作するために、外部からアクセスできるAPIを提供する必要がありました。また、構想段階ではありましたが、Wikiなどの管理画面においても、サーバーに参加しているどのプレイヤーが記述したのか、編集したのかを管理するために、プレイヤーの認証情報があると便利だと考えていました。そのため、シングルサインオンの仕組みを持つ認証基盤が必要だと考え、MineAuthを開発しました。


---

## 認証基盤

認証基盤としては、[Keycloak](https://www.keycloak.org/) や [Ory Hydra](https://www.ory.com/hydra) などの導入も検討しました。これらはセキュリティ面で実績があり、OIDCプロバイダーとして信頼性の高い選択肢です。しかし、Minecraftサーバーと連携する場合、別サーバーや外部データベースの運用が必要となり、Minecraft特有のプレイヤーデータとの統合も求められるため、全体の構成が複雑になりがちであると感じました。

また、Minecraftにはコマンドの実行などに「permission」という概念があり、これと連携することで運用管理をよりスムーズにできると考えました。実際、多くのMinecraftサーバーでは[LuckPerms](https://luckperms.net/)という権限管理プラグインが広く使われています。MineAuthはこのLuckPermsとも連携し、Minecraft内外で一貫した権限管理を実現しています。

---
image: 
  src: ./assets/scalar.avif
  alt: MineAuth API documentation with Scalar.
  caption: ScalarによるAPIドキュメント
layout: right-image
---

## 拡張性

また、MineAuthは認証だけでなく、外部プラグインがアドオンとしてAPIを追加できる基盤としても設計しています。他のプラグインはMineAuthにAPIエンドポイントを登録でき、自分のプラグインが持つデータや操作を、MineAuthの認証・認可を通して外部に公開できます。これにより、各プラグインが個別に認証機能を実装する必要がなくなり、Minecraftサーバー全体のAPI基盤として利用できます。

さらに、ScalarによるAPIドキュメントで追加されたエンドポイントを確認しやすくし、OpenTelemetryによるトレーシングでAPIリクエストや内部処理の流れも追えるようにしました。Minecraftプラグインに、SSO・OIDC・拡張可能なAPI基盤・Observabilityの考え方を取り入れたプロジェクトです。
