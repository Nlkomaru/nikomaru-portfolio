import { createFileRoute } from "@tanstack/react-router";

import StarBackground from "./-components/star-background";

export const Route = createFileRoute("/")({ component: App });

function App() {
    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <StarBackground />

            <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20">
                <p className="text-sm tracking-[0.3em] text-blue-200/80">NIKOMARU PORTFOLIO</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                    人と体験をやわらかくつなぐ、
                    <span className="text-blue-200"> Web Creator </span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                    星をモチーフにしながら、コンテンツを主役にするポートフォリオを目指しました。 React Three Fiber
                    で控えめな星空を重ねて、静かに印象を残します。
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
                        <p className="text-sm text-blue-200">Focus</p>
                        <h2 className="mt-2 text-lg font-medium">Frontend Engineering</h2>
                        <p className="mt-2 text-sm text-slate-300">TanStack Start を使った設計と UI 実装。</p>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
                        <p className="text-sm text-blue-200">Skill</p>
                        <h2 className="mt-2 text-lg font-medium">Creative Coding</h2>
                        <p className="mt-2 text-sm text-slate-300">軽量な 3D 演出でページに深度を追加します。</p>
                    </article>
                    <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
                        <p className="text-sm text-blue-200">Vision</p>
                        <h2 className="mt-2 text-lg font-medium">Simple & Memorable</h2>
                        <p className="mt-2 text-sm text-slate-300">主張しすぎず、記憶に残るビジュアルを作ります。</p>
                    </article>
                </div>
            </div>
        </main>
    );
}
