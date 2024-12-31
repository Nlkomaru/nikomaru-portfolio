"use client";
import React, { useEffect, useRef } from "react";

// const baseColorRange = Math.floor(Math.random() * 360);

const getRandomPastelColor = (isDark: boolean) => {
    const hue = Math.floor(Math.random() * 150) + 90;
    const saturation = 90 + Math.random() * 10;
    const lightness = isDark ? 80 : 80 + Math.random() * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

type Circle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
};

const speed = 0.2;
const diffLimit = 0.2;
const Scene = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const circlesRef = useRef<Circle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;
        //htmlにdata-theme="dark"があるかどうか
        const isDark = document.documentElement.dataset.theme === "dark";

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.clientHeight;
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        const footerHeight =
            document.getElementById("footer")?.clientHeight || 0;
        const count = 13 * (document.body.clientHeight / window.innerHeight);
        circlesRef.current = Array.from({ length: count }).map(() => ({
            x: (Math.random() * 0.8 + 0.1) * canvas.width,
            y: (Math.random() * 0.8 + 0.1) * (canvas.height - footerHeight),
            vx: (Math.random() * (1 - diffLimit) + diffLimit) * speed * (Math.random() < 0.5 ? -1 : 1),
            vy: (Math.random()  * (1 - diffLimit) + diffLimit)  * speed * (Math.random() < 0.5 ? -1 : 1),
            color: getRandomPastelColor(isDark),
            size: Math.random() * 1 + 0.5, // Random size between 0.5 and 1.5
        }));

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 0.5; // Set opacity to 50%

            for (const circle of circlesRef.current) {
                circle.x += circle.vx;
                circle.y += circle.vy;
                const radius = circle.size *
                        Math.min(canvas.width, window.innerHeight) *
                        0.15

                if (circle.x > canvas.width - radius || circle.x < radius)
                    circle.vx = -circle.vx;
                if (circle.y > canvas.height - footerHeight - radius || circle.y < radius)
                    circle.vy = -circle.vy;

                context.beginPath();
                context.arc(
                    circle.x,
                    circle.y,
                    radius,
                    0,
                    Math.PI * 2,
                );
                context.fillStyle = circle.color;
                context.fill();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
