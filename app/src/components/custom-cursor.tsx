import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a") || target.closest("button") || target.closest("[data-hover]")) {
                setIsHovering(true);
            }
        };

        const handleOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a") || target.closest("button") || target.closest("[data-hover]")) {
                setIsHovering(false);
            }
        };

        const handleLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseover", handleOver);
        window.addEventListener("mouseout", handleOut);
        document.addEventListener("mouseleave", handleLeave);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseover", handleOver);
            window.removeEventListener("mouseout", handleOut);
            document.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    if (typeof window !== "undefined" && "ontouchstart" in window) {
        return null;
    }

    return (
        <motion.div
            className={css({
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                display: { base: "none", md: "block" },
                pointerEvents: "none",
                mixBlendMode: "difference",
            })}
            animate={{
                x: position.x - (isHovering ? 30 : 6),
                y: position.y - (isHovering ? 30 : 6),
                width: isHovering ? 60 : 12,
                height: isHovering ? 60 : 12,
                opacity: isVisible ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        >
            <div
                className={css({
                    h: "full",
                    w: "full",
                    borderRadius: "full",
                    borderWidth: "1px",
                    borderColor: "white",
                })}
                style={{ backgroundColor: isHovering ? "rgba(255,255,255,0.08)" : "white" }}
            />
        </motion.div>
    );
}
