import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { css } from "styled-system/css";
import CustomCursor from "../components/custom-cursor";
import NoiseOverlay from "../components/noise-overlay";
import { Button } from "../components/ui";

export const Route = createFileRoute("/")({ component: App });

const projects = [
    {
        id: 1,
        title: "CONCRETE\nDREAMS",
        category: "Architecture",
        year: "2025",
        color: "#e74c3c",
        image: "https://images.unsplash.com/photo-1769283979195-d418a41ae2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBjb25jcmV0ZXxlbnwxfHx8fDE3NzIxMTQ4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
        id: 2,
        title: "NEON\nNOIR",
        category: "Photography",
        year: "2025",
        color: "#9b59b6",
        image: "https://images.unsplash.com/photo-1618902410393-6fe0a34bb79e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwZGFyayUyMGN5YmVycHVua3xlbnwxfHx8fDE3NzIxNjA1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
        id: 3,
        title: "FORM\n& VOID",
        category: "Sculpture",
        year: "2024",
        color: "#2ecc71",
        image: "https://images.unsplash.com/photo-1656332694386-3dd2734e63c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNjdWxwdHVyZSUyMG1vZGVybiUyMGFydHxlbnwxfHx8fDE3NzIxNjA1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
        id: 4,
        title: "SILENT\nWATERS",
        category: "Fine Art",
        year: "2024",
        color: "#3498db",
        image: "https://images.unsplash.com/photo-1750473511825-1d6e3b09e562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYWVyaWFsJTIwZGFya3xlbnwxfHx8fDE3NzIwODYxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
];

function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section
            ref={ref}
            className={css({
                position: "relative",
                display: "flex",
                h: "100vh",
                alignItems: "center",
                overflow: "hidden",
            })}
        >
            <motion.div
                style={{ y, opacity }}
                className={css({
                    position: "relative",
                    zIndex: 10,
                    w: "full",
                    px: { base: "8", md: "20" },
                })}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >
                    <p
                        className={css({
                            mb: "8",
                            fontSize: "0.5625rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5em",
                            color: "fg.muted",
                        })}
                        style={{ fontFamily: '"Space Mono", monospace' }}
                    >
                        Creative Direction & Design
                    </p>
                </motion.div>

                <div className={css({ overflow: "hidden" })}>
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className={css({
                            fontSize: { base: "3rem", md: "6rem", lg: "8rem" },
                            letterSpacing: "-0.03em",
                            color: "fg.default",
                        })}
                        style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, lineHeight: 0.9 }}
                    >
                        Make it
                    </motion.h1>
                </div>
                <div className={css({ overflow: "hidden" })}>
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
                        className={css({
                            fontSize: { base: "3rem", md: "6rem", lg: "8rem" },
                            letterSpacing: "-0.03em",
                            fontStyle: "italic",
                        })}
                        style={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            lineHeight: 0.9,
                            color: "transparent",
                            WebkitTextStroke: "1px rgba(31,41,55,0.4)",
                        }}
                    >
                        unforgettable
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className={css({ mt: "12", display: "flex", alignItems: "center", gap: "8" })}
                >
                    <div className={css({ h: "1px", w: "16", bg: "border.default" })} />
                    <p
                        className={css({
                            maxW: "xs",
                            fontSize: "0.625rem",
                            letterSpacing: "0.08em",
                            color: "fg.muted",
                        })}
                        style={{ fontFamily: '"Space Mono", monospace', lineHeight: 1.8 }}
                    >
                        Crafting visual narratives at the intersection of art and technology
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className={css({
                    position: "absolute",
                    right: { base: "8", md: "16" },
                    bottom: "10",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3",
                })}
            >
                <span
                    className={css({
                        fontSize: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.3em",
                        color: "fg.subtle",
                    })}
                    style={{ fontFamily: '"Space Mono", monospace', writingMode: "vertical-rl" }}
                >
                    Scroll
                </span>
                <motion.div
                    animate={{ height: [20, 40, 20] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                    className={css({ w: "1px", bg: "border.default" })}
                />
            </motion.div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            data-hover
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={css({
                position: "relative",
                cursor: "pointer",
                borderTopWidth: "1px",
                borderColor: "border.subtle",
                py: { base: "8", md: "12" },
            })}
        >
            <div
                className={css({
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    px: { base: "8", md: "20" },
                })}
            >
                <div className={css({ display: "flex", alignItems: "flex-start", gap: { base: "6", md: "12" } })}>
                    <span
                        className={css({
                            mt: "2",
                            display: { base: "none", md: "block" },
                            fontSize: "0.625rem",
                            color: "fg.muted",
                        })}
                        style={{ fontFamily: '"Space Mono", monospace' }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                        <h2
                            className={css({
                                whiteSpace: "pre-line",
                                fontSize: { base: "1.5rem", md: "2.5rem", lg: "3.5rem" },
                                transition: "all 0.7s ease",
                            })}
                            style={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 300,
                                lineHeight: 1,
                                color: hovered ? project.color : "var(--colors-fg-default)",
                            }}
                        >
                            {project.title}
                        </h2>
                        <div className={css({ mt: "4", display: "flex", alignItems: "center", gap: "4" })}>
                            <span
                                className={css({
                                    fontSize: "0.5625rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3em",
                                    transition: "color 0.5s ease",
                                })}
                                style={{
                                    fontFamily: '"Space Mono", monospace',
                                    color: hovered ? project.color : "var(--colors-fg-muted)",
                                }}
                            >
                                {project.category}
                            </span>
                            <span
                                className={css({ fontSize: "0.5625rem", color: "fg.muted" })}
                                style={{ fontFamily: '"Space Mono", monospace' }}
                            >
                                {project.year}
                            </span>
                        </div>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: hovered ? 45 : 0 }}
                    transition={{ duration: 0.4 }}
                    className={css({
                        mt: "2",
                        display: { base: "none", md: "block" },
                        fontSize: "1.5rem",
                        color: "fg.subtle",
                    })}
                >
                    +
                </motion.div>
            </div>

            <motion.div
                initial={false}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9, x: hovered ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className={css({
                    pointerEvents: "none",
                    position: "absolute",
                    top: "50%",
                    right: { base: "8", md: "20" },
                    zIndex: 10,
                    display: { base: "none", md: "block" },
                    w: { md: "48", lg: "64" },
                    transform: "translateY(-50%)",
                })}
            >
                <div
                    className={css({
                        position: "relative",
                        aspectRatio: "3 / 4",
                        overflow: "hidden",
                        borderRadius: "l3",
                        boxShadow: "md",
                    })}
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        className={css({
                            h: "full",
                            w: "full",
                            objectFit: "cover",
                            transition: "all 0.7s ease",
                        })}
                        style={{ filter: hovered ? "grayscale(0%)" : "grayscale(100%)" }}
                    />
                    <div
                        className={css({
                            position: "absolute",
                            inset: 0,
                            transition: "opacity 0.5s ease",
                        })}
                        style={{ backgroundColor: project.color, opacity: hovered ? 0.1 : 0, mixBlendMode: "overlay" }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

function MarqueeSection() {
    const marqueeRows = ["DESIGN", "DEVELOP", "CREATE", "INSPIRE", "INNOVATE", "EXPLORE"];
    const marqueeGroups = ["group-1", "group-2", "group-3"];

    return (
        <div
            className={css({
                overflow: "hidden",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderColor: "border.subtle",
                py: "16",
            })}
        >
            <motion.div
                animate={{ x: [0, -1920] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30, ease: "linear" }}
                className={css({ display: "flex", alignItems: "center", gap: "16", whiteSpace: "nowrap" })}
            >
                {marqueeGroups.map((groupKey) => (
                    <div key={groupKey} className={css({ display: "flex", alignItems: "center", gap: "16" })}>
                        {marqueeRows.map((word) => (
                            <span
                                key={`${groupKey}-${word}`}
                                className={css({ fontSize: { base: "1.5rem", md: "3rem" }, letterSpacing: "0.05em" })}
                                style={{
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontWeight: 300,
                                    color: "transparent",
                                    WebkitTextStroke: "0.5px rgba(31,41,55,0.16)",
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function App() {
    return (
        <div className={css({ minH: "100vh", cursor: "none", bg: "bg.canvas", color: "fg.default" })}>
            <CustomCursor />
            <NoiseOverlay />
            <HeroSection />
            <MarqueeSection />

            <section className={css({ py: { base: "16", md: "24" } })}>
                <div className={css({ mb: "12", px: { base: "8", md: "20" } })}>
                    <p
                        className={css({
                            fontSize: "0.5625rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5em",
                            color: "fg.muted",
                        })}
                        style={{ fontFamily: '"Space Mono", monospace' }}
                    >
                        Selected Works
                    </p>
                </div>
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
                <div className={css({ borderTopWidth: "1px", borderColor: "border.subtle" })} />
            </section>

            <section className={css({ px: { base: "8", md: "20" }, py: "32", textAlign: "center" })}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p
                        className={css({
                            mb: "6",
                            fontSize: "0.5625rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5em",
                            color: "fg.muted",
                        })}
                        style={{ fontFamily: '"Space Mono", monospace' }}
                    >
                        Let&apos;s collaborate
                    </p>
                    <h2
                        className={css({ mb: "8", fontSize: { base: "2rem", md: "4rem" }, color: "fg.default" })}
                        style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, lineHeight: 1.1 }}
                    >
                        Have a project
                        <br />
                        <span
                            style={{
                                color: "transparent",
                                WebkitTextStroke: "1px rgba(31,41,55,0.32)",
                                fontStyle: "italic",
                            }}
                        >
                            in mind?
                        </span>
                    </h2>
                    <Button
                        as={Link}
                        to="/contact"
                        data-hover
                        variant="outline"
                        size="lg"
                        className={css({
                            fontSize: "0.625rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.3em",
                            fontFamily: '"Space Mono", monospace',
                        })}
                    >
                        Start a conversation
                    </Button>
                </motion.div>
            </section>

            <footer
                className={css({
                    display: "flex",
                    flexDirection: { base: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "4",
                    borderTopWidth: "1px",
                    borderColor: "border.subtle",
                    px: { base: "8", md: "20" },
                    py: "8",
                })}
            >
                <p
                    className={css({ fontSize: "0.5625rem", letterSpacing: "0.08em", color: "fg.muted" })}
                    style={{ fontFamily: '"Space Mono", monospace' }}
                >
                    &copy; 2026 — All rights reserved
                </p>
                <div className={css({ display: "flex", gap: "6" })}>
                    {[
                        { label: "Tw", href: "https://x.com/" },
                        { label: "Ig", href: "https://www.instagram.com/" },
                        { label: "Dr", href: "https://dribbble.com/" },
                        { label: "Be", href: "https://www.behance.net/" },
                    ].map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            data-hover
                            className={css({
                                fontSize: "0.5625rem",
                                letterSpacing: "0.08em",
                                color: "fg.muted",
                                transition: "color 0.5s ease",
                                _hover: {
                                    color: "fg.default",
                                },
                            })}
                            style={{ fontFamily: '"Space Mono", monospace' }}
                        >
                            {social.label}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}
