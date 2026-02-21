import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

function StarField() {
    const groupRef = useRef<Group>(null);

    const stars = useMemo(() => {
        return Array.from({ length: 320 }, (_, index) => ({
            id: `star-${index}-${Math.random().toString(36).slice(2, 9)}`,
            position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 18],
            scale: Math.random() * 0.03 + 0.008,
            opacity: Math.random() * 0.55 + 0.25,
        }));
    }, []);

    useFrame((state) => {
        if (!groupRef.current) {
            return;
        }

        groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
    });

    return (
        <group ref={groupRef}>
            {stars.map((star) => (
                <mesh key={star.id} position={star.position as [number, number, number]}>
                    <sphereGeometry args={[star.scale, 8, 8]} />
                    <meshBasicMaterial color="#f8fbff" transparent opacity={star.opacity} />
                </mesh>
            ))}
        </group>
    );
}

function StarPortfolioBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <Canvas camera={{ position: [0, 0, 4], fov: 58 }}>
                <ambientLight intensity={0.45} />
                <StarField />
            </Canvas>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.16),transparent_48%)]" />
        </div>
    );
}

function StarPortfolioContent() {
    return (
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center px-6 py-16">
            <div className="max-w-2xl space-y-6 rounded-2xl border border-white/10 bg-slate-900/45 p-8 backdrop-blur-sm">
                <p className="text-sm tracking-[0.24em] text-slate-300 uppercase">Nikomaru Portfolio</p>
                <h1 className="text-4xl leading-tight font-semibold text-white md:text-5xl">
                    星の静けさを背景にした
                    <br />
                    シンプルなクリエイターポートフォリオ
                </h1>
                <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                    React Three
                    Fiberで控えめに動く星空を重ねて、作品紹介やプロフィールが読みやすい余白を残したトップページにした。
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-full border border-slate-500/60 bg-slate-800/65 px-4 py-1.5">
                        Frontend
                    </span>
                    <span className="rounded-full border border-slate-500/60 bg-slate-800/65 px-4 py-1.5">Motion</span>
                    <span className="rounded-full border border-slate-500/60 bg-slate-800/65 px-4 py-1.5">
                        3D Experience
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function StarPortfolio() {
    return (
        <main className="relative isolate overflow-hidden">
            <StarPortfolioBackground />
            <StarPortfolioContent />
        </main>
    );
}
