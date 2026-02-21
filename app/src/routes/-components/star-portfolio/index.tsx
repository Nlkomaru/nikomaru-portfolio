import { PointMaterial, Points } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

function StarPoints() {
    const pointsRef = useRef<Group>(null);

    const positions = useMemo(() => {
        const randomPositions = new Float32Array(3000);

        for (let index = 0; index < randomPositions.length; index += 3) {
            randomPositions[index] = (Math.random() - 0.5) * 18;
            randomPositions[index + 1] = (Math.random() - 0.5) * 10;
            randomPositions[index + 2] = (Math.random() - 0.5) * 12;
        }

        return randomPositions;
    }, []);

    return (
        <group ref={pointsRef} rotation={[0, 0, Math.PI / 6]}>
            <Points positions={positions} stride={3} frustumCulled>
                <PointMaterial transparent color="#dbeafe" size={0.03} sizeAttenuation depthWrite={false} />
            </Points>
        </group>
    );
}

export function StarPortfolio() {
    return (
        <section className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.8),_rgba(2,6,23,1)_60%)]" />

            <div className="absolute inset-0 opacity-60">
                <Canvas camera={{ position: [0, 0, 4] }}>
                    <ambientLight intensity={0.35} />
                    <StarPoints />
                </Canvas>
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col justify-center gap-6 px-6 py-20">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Nikomaru Portfolio</p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
                    星の静けさを背景に、
                    <br />
                    作ったものを丁寧に見せる場所
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                    React Three Fiberで、主張しすぎない星空を重ねたポートフォリオなのだ。
                    作品やプロフィールが読みやすいように、明るさと密度を控えめに調整しているのだ。
                </p>
                <div className="flex gap-3">
                    <a
                        href="/slides"
                        className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
                    >
                        スライドを見る
                    </a>
                </div>
            </div>
        </section>
    );
}
