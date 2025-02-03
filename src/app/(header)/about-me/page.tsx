import { css } from "@/styled-system/css";
import { styled } from "@/styled-system/jsx";
import { Certification } from "~/components/about-me/certification";
import { loremJapanese } from "~/lib/util";

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
            <p>
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
            <p className={css({ marginTop: "4px" })}>
                このポートフォリオサイトは、Next.js + Vercel
                を利用して構築し、ヘッドレスUIとしてArk UIを利用、CSS in
                JSとしてPanda CSSを利用しています。
                また、コンポーネントライブラリ及びデザインシステムとしてPark
                UIを利用し、Figmaを利用してデザインを行いました。
            </p>

            <Heading3>Infrastructure</Heading3>
            <p>
                マインクラフトサーバーの運用の際に、ネットワークの設定や
                セキュリティの設定、バックアップの設定などを行っており、このあたりの技術についても興味があります。
                <br />
                自宅では、ミニpcを利用して、k8sのシングルノードクラスタを構築し、ArgoCDを利用した
                GitOpsの運用や、Grafana + Prometheus +
                NodeExporterを利用したモニタリングを行っています。
            </p>

            <Heading2>Career</Heading2>
            {loremJapanese(200)}

            <Heading2>Certification</Heading2>
            <Certification />
        </div>
    );
}

const Heading2 = styled("h2", {
    base: {
        fontSize: {
            base: "1.25rem",
            md: "1.5rem",
            lg: "2rem",
        },
        marginTop: "2rem",
    },
});

const Heading3 = styled("h3", {
    base: {
        fontSize: {
            base: "1rem",
            md: "1.25rem",
            lg: "1.5rem",
        },
        marginTop: "2rem",
    },
});
