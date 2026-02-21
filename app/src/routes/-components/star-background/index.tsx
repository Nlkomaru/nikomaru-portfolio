import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";

function StarPoints() {
    // 控えめな星空にするため、点の数と範囲を固定して軽量に生成する。
    const positions = useMemo(() => {
        const points = new Float32Array(900);

        for (let index = 0; index < points.length; index += 3) {
            points[index] = (Math.random() - 0.5) * 30;
            points[index + 1] = (Math.random() - 0.5) * 18;
            points[index + 2] = (Math.random() - 0.5) * 20;
        }

        return points;
    }, []);

    const pointsRef = useRef<Points>(null);

    useFrame((_, delta) => {
        if (!pointsRef.current) {
            return;
        }

        pointsRef.current.rotation.y += delta * 0.02;
        pointsRef.current.rotation.x += delta * 0.005;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="#dbeafe" size={0.06} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
        </points>
    );
}

export default function StarBackground() {
    if (typeof window === "undefined") {
        return null;
    }

    return (
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-80">
            <Canvas camera={{ position: [0, 0, 10], fov: 55 }}>
                <color attach="background" args={["#020617"]} />
                <StarPoints />
            </Canvas>
        </div>
    );
}
