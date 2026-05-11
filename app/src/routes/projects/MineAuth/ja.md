---
slug: MineAuth
title: MineAuth
abstract: >-
  An OAuth 2.1 / OpenID Connect provider built for the Minecraft ecosystem —
  turning player identity into a first-class, standards-compliant primitive for
  tools, servers, and modern web applications.
metaItems:
  - term: Role
    description: Developer
  - term: Stack
    description: Kotlin · Ktor · PostgreSQL
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
  src: /projects/mineauth/community.png
  alt: MineAuth Community
---
image: 
  src: /projects/mineauth/scalar.png
  alt: MineAuth API documentation with Scalar.
  caption: MineAuth API documentation with Scalar
layout: left-image
---

MineAuth は、MinecraftサーバーにSSOを導入し、Webアプリケーションや外部サービスからプレイヤーデータを安全に扱えるようにするために開発したプラグインです。Minecraftアカウントやサーバー内のプレイヤー情報をもとに、Webサイトや管理画面へログインできる仕組みを作ることを目的としています。そのため、単なる独自ログイン機能ではなく、外部サービスから扱いやすい標準的な認証方式として OAuth2 / OpenID Connect に対応しました。OIDCに対応することで、Minecraftサーバーを認証プロバイダのように扱い、Webアプリケーション側では一般的なSSOの仕組みとして連携できるようにしています。

---

認証基盤としては Keycloak や Ory Hydra なども検討しました。これらはセキュリティ面で実績があり、OIDCプロバイダとして信頼性の高い選択肢です。一方で、Minecraftサーバーと連携する場合には、別サーバーや外部データベースの運用、Minecraft固有のプレイヤーデータとの接続が必要になり、構成が複雑になりやすいと感じました。MineAuthでは、既存の認証基盤を参考にしつつ、Minecraftプラグインとしてサーバー内で動作する形にすることで、プレイヤー情報や権限と直接連携できる構成にしました。

---

また、MineAuthは認証だけでなく、外部プラグインがアドオンとしてAPIを追加できる基盤としても設計しています。他のプラグインはMineAuthにAPIエンドポイントを登録でき、自分のプラグインが持つデータや操作を、MineAuthの認証・認可を通して外部に公開できます。これにより、各プラグインが個別に認証機能を実装する必要がなくなり、Minecraftサーバー全体のAPI基盤として利用できます。さらに、ScalarによるAPIドキュメントで追加されたエンドポイントを確認しやすくし、OpenTelemetryによるトレーシングでAPIリクエストや内部処理の流れも追えるようにしました。Minecraftプラグインに、SSO・OIDC・拡張可能なAPI基盤・Observabilityの考え方を取り入れたプロジェクトです。
