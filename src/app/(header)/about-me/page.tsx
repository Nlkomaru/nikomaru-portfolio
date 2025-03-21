import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import { Career } from "~/components/about-me/career";
import { Certification } from "~/components/about-me/certification";

export default function Home() {
    return (
        <div
            className={css({
                maxWidth: "1024px",
                margin: "auto",
            })}
        >
            <Heading2>Skills</Heading2>
            <Heading3>Backend</Heading3>
            <p className={css({ marginBottom: "2rem" })}>
                Minecraftサーバーのプラグイン開発を行っており、外部からの操作を可能にするために
                Kotlin + Ktor を活用したバックエンドシステムを構築したり、
                プレイヤーごとのデータの管理・及びアクセスのための認可認証(OAuth
                2.0/ OpenID Connect)のシステムを構築したりしています。
            </p>
            <Heading3>Frontend</Heading3>
            <p>
                2024年の10月あたりから、Webのフロントエンド開発を行ってきました。主に、Next.js
                + TypeScript を利用して開発を行っています。
                最近は、Qwikを利用した開発に少し興味があります。
            </p>
            <p className={css({ marginTop: "4px", marginBottom: "2rem" })}>
                このポートフォリオサイトは、Next.jsをベースに構築し、
                ヘッドレスUIライブラリとしてArk UI、スタイリングにはPanda
                CSS(CSS in JS)を採用しています。
                デプロイ環境としてはOpenNextを用いてCloudflare
                Workersへ展開しています。
                また、UIコンポーネントとデザインシステムにはPark UIを採用し、
                デザインの設計はFigmaで行いました。
            </p>

            <Heading3>Infrastructure</Heading3>
            <p className={css({ marginBottom: "2rem" })}>
                マインクラフトサーバーの運用の際に、ネットワークの設定や
                セキュリティの設定、バックアップの設定などを行っており、このあたりの技術についても興味があります。
                <br />
                自宅では、ミニpcを利用して、k8sのシングルノードクラスタを構築し、ArgoCDを利用した
                GitOpsの運用や、Grafana + Prometheus +
                NodeExporterを利用したモニタリングを行っています。
            </p>

            <Heading2>Career</Heading2>
            <Career />

            <Heading2>Certification</Heading2>
            <Certification />
        </div>
    );
}

const Heading2 = styled("h2", {
    base: {
        fontSize: {
            base: "1.5rem",
            md: "1.75rem",
            lg: "2rem",
        },
        marginTop: "2rem",
        fontWeight: "bold",
    },
});

const Heading3 = styled("h3", {
    base: {
        fontSize: {
            base: "1.25rem",
            md: "1.5rem",
            lg: "1.75rem",
        },
        fontWeight: "bold",
    },
});
