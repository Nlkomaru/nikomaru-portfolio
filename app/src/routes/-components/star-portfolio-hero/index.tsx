import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

/**
 * 星を控えめに配置したヒーローセクション。
 * 背景の3D演出と本文を重ねる構成にしている。
 */
export default function StarPortfolioHero() {
    // SSR時にWebGL依存の描画が走らないよう、クライアントマウント後のみCanvasを表示する。
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // マウント完了時にクライアント描画を有効化する。
        setIsClient(true);
    }, []);

    return (
        <main className="relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_58%)]" />

            <div className="pointer-events-none absolute inset-0 opacity-65">
                {isClient ? (
                    <Canvas camera={{ fov: 56, position: [0, 0, 1] }}>
                        <color attach="background" args={["#020617"]} />
                        <Stars radius={70} depth={32} count={2500} factor={2.2} saturation={0} fade speed={0.28} />
                    </Canvas>
                ) : null}
            </div>

            <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start justify-center gap-8 px-6 py-28 sm:px-10 md:py-36">
                <p className="text-xs tracking-[0.25em] text-slate-300/85 uppercase">NIKOMARU PORTFOLIO</p>
                <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance md:text-6xl">
                    静かな星空の奥行きで、
                    <br className="hidden md:block" />
                    作品の魅力をやわらかく届ける。
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    React Three Fiberで、主張しすぎない星の表現を背景に配置。
                    コンテンツを読みやすく保ちながら、奥行きと余韻のあるポートフォリオ体験を目指しました。
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <a
                        className="rounded-full border border-slate-200/20 bg-slate-50/10 px-5 py-2.5 font-medium text-slate-50 transition hover:bg-slate-50/20"
                        href="/slides"
                    >
                        View Works
                    </a>
                    <a
                        className="rounded-full border border-slate-500/35 px-5 py-2.5 font-medium text-slate-200 transition hover:border-slate-300/70 hover:text-slate-50"
                        href="mailto:hello@nikomaru.dev"
                    >
                        Contact
                    </a>
                </div>
            </section>
        </main>
    );
}
