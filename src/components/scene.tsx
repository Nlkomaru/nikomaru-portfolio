"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const getRandomPastelColor = (isDark: boolean) => {
    const hue = Math.floor(Math.random() * 150) + 70; //色相は70～220
    const saturation = isDark ? 25 : 90 + Math.random() * 10; //彩度は90～100
    const lightness = isDark ? 35 : 80 + Math.random() * 10; //明度は20～90
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // hsl(色相, 彩度, 明度)
};

type Circle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
};

const diffLimit = 0.2;

const Scene = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const circlesRef = useRef<Circle[]>([]);
    const pathname = usePathname();
    const { theme } = useTheme();
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        setSpeed(0.5);
        if (typeof window === "undefined") return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const isDark = theme === "dark";

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.clientHeight;
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        const footerHeight =
            document.getElementById("footer")?.clientHeight || 0;
        const count = 9 * (document.body.clientHeight / window.innerHeight);
        circlesRef.current = Array.from({ length: count }).map(() => {
            const radius = Math.random() * 1 + 0.5;
            const adjustedRadius =
                radius * Math.min(canvas.width, window.innerHeight) * 0.15;

            const getRandomVelocity = () =>
                (Math.random() * (1 - diffLimit) + diffLimit) *
                speed *
                (Math.random() < 0.5 ? -1 : 1);

            return {
                x:
                    Math.random() * (canvas.width - 2 * adjustedRadius) +
                    adjustedRadius,
                y:
                    Math.random() *
                        (canvas.height - footerHeight - 2 * adjustedRadius) +
                    adjustedRadius,
                vx: getRandomVelocity(),
                vy: getRandomVelocity(),
                color: getRandomPastelColor(isDark),
                size: radius,
            };
        }, [theme, pathname, speed]);

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 0.5;

            for (const circle of circlesRef.current) {
                circle.x += circle.vx;
                circle.y += circle.vy;
                const radius =
                    circle.size *
                    Math.min(canvas.width, window.innerHeight) *
                    0.15;

                if (circle.x > canvas.width - radius || circle.x < radius) {
                    circle.vx = -circle.vx;
                }

                if (
                    circle.y > canvas.height - footerHeight - radius ||
                    circle.y < radius
                ) {
                    circle.vy = -circle.vy;
                }

                context.beginPath();
                context.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
                context.fillStyle = circle.color;
                context.fill();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [theme, pathname, speed]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                //画面全体でなく、ページ全体
                zIndex: -100,
            }}
        />
    );
};

export default Scene;
