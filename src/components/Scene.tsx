"use client";
import { css } from "@/styled-system/css";
import React, { useEffect, useRef, useState } from "react";

//透明度
const transparency = 0.6;

const getRandomBrightColor = () => {
    const r = Math.floor(
        Math.random() * (255 * transparency) + 255 * transparency,
    );
    const g = Math.floor(
        Math.random() * (255 * transparency) + 255 * transparency,
    );
    const b = Math.floor(
        Math.random() * (255 * transparency) + 255 * transparency,
    );
    return `rgb(${r}, ${g}, ${b})`;
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

const Scene = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const circlesRef = useRef<Circle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.clientHeight;
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        const count = 5 * (document.body.clientHeight / window.innerHeight);
        console.log(count);
        circlesRef.current = Array.from({ length: count }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * speed - speed / 2,
            vy: Math.random() * speed - speed / 2,
            color: getRandomBrightColor(),
            size: Math.random() * 1.0 + 0.5, // Random size between 0.5 and 1.5
        }));

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalAlpha = 0.5; // Set opacity to 50%

            for (const circle of circlesRef.current) {
                circle.x += circle.vx;
                circle.y += circle.vy;

                if (circle.x > canvas.width || circle.x < 0)
                    circle.vx = -circle.vx;
                if (circle.y > canvas.height || circle.y < 0)
                    circle.vy = -circle.vy;

                context.beginPath();
                context.arc(
                    circle.x,
                    circle.y,
                    circle.size *
                        Math.min(canvas.width, window.innerHeight) *
                        0.15,
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
