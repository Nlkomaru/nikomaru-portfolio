import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";

const STAR_COUNT = 900;

function StarPoints() {
    const pointsRef = useRef<Points>(null);

    const starPositions = useMemo<Float32Array>(() => {
        const positions = new Float32Array(STAR_COUNT * 3);

        for (let index = 0; index < STAR_COUNT; index += 1) {
            const offset = index * 3;
            // Place stars in a broad cube so the effect stays calm instead of flashy.
            positions[offset] = (Math.random() - 0.5) * 22;
            positions[offset + 1] = (Math.random() - 0.5) * 14;
            positions[offset + 2] = (Math.random() - 0.5) * 22;
        }

        return positions;
    }, []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) {
            return;
        }

        pointsRef.current.rotation.y = clock.elapsedTime * 0.03;
        pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.04;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    args={[starPositions, 3]}
                    attach="attributes-position"
                    count={starPositions.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="#f8fbff" opacity={0.8} size={0.03} sizeAttenuation transparent />
        </points>
    );
}

export function StarPortfolioHero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <Canvas camera={{ fov: 50, position: [0, 0, 6] }} className="absolute inset-0">
                <color args={["#030712"]} attach="background" />
                <ambientLight intensity={0.3} />
                <StarPoints />
            </Canvas>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-6 py-24">
                <p className="text-sm tracking-[0.35em] text-sky-200/80 uppercase">NIKOMARU PORTFOLIO</p>
                <h1 className="max-w-2xl text-4xl leading-tight font-semibold text-balance sm:text-6xl">
                    Crafting quiet digital experiences with a gentle cosmic mood.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    星をテーマにしながら、落ち着いたトーンで作品を見せるポートフォリオにしました。必要以上に主張しない
                    星空の演出で、プロジェクトの内容に自然と目が向く構成です。
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                    <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5">React</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5">TanStack Start</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
                        React Three Fiber
                    </span>
                </div>
            </div>
        </section>
    );
}
