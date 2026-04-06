import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { css } from "styled-system/css";

const works = [
    {
        id: 1,
        title: "Concrete Dreams",
        category: "Architecture",
        year: "2025",
        color: "#e74c3c",
        image: "https://images.unsplash.com/photo-1769283979195-d418a41ae2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBjb25jcmV0ZXxlbnwxfHx8fDE3NzIxMTQ4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "Exploring the raw beauty of brutalist architecture through a minimalist lens.",
    },
    {
        id: 2,
        title: "Neon Noir",
        category: "Photography",
        year: "2025",
        color: "#9b59b6",
        image: "https://images.unsplash.com/photo-1618902410393-6fe0a34bb79e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwZGFyayUyMGN5YmVycHVua3xlbnwxfHx8fDE3NzIxNjA1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "A nocturnal journey through the electric veins of the modern metropolis.",
    },
    {
        id: 3,
        title: "Form & Void",
        category: "Sculpture",
        year: "2024",
        color: "#2ecc71",
        image: "https://images.unsplash.com/photo-1656332694386-3dd2734e63c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNjdWxwdHVyZSUyMG1vZGVybiUyMGFydHxlbnwxfHx8fDE3NzIxNjA1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "Investigating the tension between presence and absence in three-dimensional space.",
    },
    {
        id: 4,
        title: "Silent Waters",
        category: "Fine Art",
        year: "2024",
        color: "#3498db",
        image: "https://images.unsplash.com/photo-1750473511825-1d6e3b09e562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYWVyaWFsJTIwZGFya3xlbnwxfHx8fDE3NzIwODYxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "Capturing the meditative quality of water from perspectives rarely seen.",
    },
    {
        id: 5,
        title: "Dark Portrait",
        category: "Photography",
        year: "2024",
        color: "#e67e22",
        image: "https://images.unsplash.com/photo-1736366285834-25ad1e00c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBwb3J0cmFpdCUyMGFydGlzdGljfGVufDF8fHx8MTc3MjA4MDYyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "Embracing shadow and light to reveal the unseen layers of identity.",
    },
    {
        id: 6,
        title: "Editorial Gaze",
        category: "Fashion",
        year: "2025",
        color: "#1abc9c",
        image: "https://images.unsplash.com/photo-1771072426459-1ab467cd80f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyMDgwNjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "Where fashion meets fine art in a dialogue of form and expression.",
    },
];

export const Route = createFileRoute("/works/")({
    component: WorksPage,
});

function WorkItem({ work, index }: { work: (typeof works)[0]; index: number }) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={css({
                display: "grid",
                cursor: "pointer",
                gridTemplateColumns: { base: "1fr", md: "repeat(12, minmax(0, 1fr))" },
                alignItems: "center",
                gap: { base: "6", md: "0" },
                py: { base: "12", md: "20" },
            })}
        >
            <div
                className={css({
                    position: "relative",
                    overflow: "hidden",
                    gridColumn: { md: "span 6 / span 6" },
                    gridColumnStart: { md: isEven ? "1" : "7" },
                })}
                style={{ order: isEven ? 1 : 2 }}
            >
                <div className={css({ position: "relative", aspectRatio: "4 / 5", overflow: "hidden" })}>
                    <motion.img
                        src={work.image}
                        alt={work.title}
                        className={css({
                            h: "120%",
                            w: "full",
                            objectFit: "cover",
                            transition: "all 1s ease",
                        })}
                        style={{ y: imgY, filter: hovered ? "grayscale(0%)" : "grayscale(100%)" }}
                    />
                    <div
                        className={css({
                            position: "absolute",
                            inset: 0,
                            transition: "all 0.7s ease",
                        })}
                        style={{
                            background: hovered ? `linear-gradient(135deg, ${work.color}15, transparent)` : "none",
                        }}
                    />
                </div>

                <div
                    className={css({
                        position: "absolute",
                        top: "4",
                        left: "4",
                        fontSize: "0.5rem",
                        letterSpacing: "0.3em",
                        transition: "color 0.5s ease",
                    })}
                    style={{
                        fontFamily: "'Space Mono', monospace",
                        color: hovered ? work.color : "rgba(31,41,55,0.4)",
                    }}
                >
                    {String(index + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
                </div>
            </div>

            <div
                className={css({
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gridColumn: { md: "span 5 / span 5" },
                    gridColumnStart: { md: isEven ? "8" : "1" },
                    pl: { md: isEven ? "12" : "0" },
                    pr: { md: isEven ? "0" : "12" },
                })}
                style={{ order: isEven ? 2 : 1 }}
            >
                <span
                    className={css({
                        mb: "4",
                        fontSize: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.4em",
                        transition: "color 0.5s ease",
                    })}
                    style={{
                        fontFamily: "'Space Mono', monospace",
                        color: hovered ? work.color : "var(--colors-fg-muted)",
                    }}
                >
                    {work.category} - {work.year}
                </span>

                <h2
                    className={css({
                        fontSize: { base: "1.75rem", md: "2.5rem" },
                        transition: "color 0.7s ease",
                    })}
                    style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        lineHeight: 1.1,
                        color: hovered ? "var(--colors-fg-default)" : "rgba(31,41,55,0.7)",
                    }}
                >
                    {work.title}
                </h2>

                <p
                    className={css({
                        mt: "4",
                        maxW: "sm",
                        fontSize: "0.6875rem",
                        transition: "color 0.5s ease",
                    })}
                    style={{
                        fontFamily: "'Space Mono', monospace",
                        lineHeight: 1.8,
                        color: hovered ? "rgba(31,41,55,0.7)" : "rgba(31,41,55,0.45)",
                    }}
                >
                    {work.description}
                </p>

                <div className={css({ mt: "8", display: "flex", alignItems: "center", gap: "3" })}>
                    <motion.div
                        animate={{ width: hovered ? 48 : 24 }}
                        transition={{ duration: 0.5 }}
                        className={css({ h: "1px" })}
                        style={{ backgroundColor: hovered ? work.color : "rgba(31,41,55,0.16)" }}
                    />
                    <span
                        className={css({
                            fontSize: "0.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.3em",
                            transition: "color 0.5s ease",
                        })}
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            color: hovered ? work.color : "rgba(31,41,55,0.45)",
                        }}
                    >
                        View project
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function WorksPage() {
    return (
        <div className={css({ minH: "100vh", bg: "bg.canvas" })}>
            <section className={css({ px: { base: "8", md: "20" }, pt: { base: "20", md: "32" }, pb: "8" })}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p
                        className={css({
                            mb: "4",
                            fontSize: "0.5625rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5em",
                            color: "fg.muted",
                        })}
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Archive - {works.length} Projects
                    </p>
                    <h1
                        className={css({ fontSize: { base: "2.5rem", md: "5rem" }, color: "fg.default" })}
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                            lineHeight: 1,
                        }}
                    >
                        Works
                    </h1>
                </motion.div>
            </section>

            <section className={css({ px: { base: "8", md: "12" } })}>
                {works.map((work, index) => (
                    <WorkItem key={work.id} work={work} index={index} />
                ))}
            </section>
        </div>
    );
}
