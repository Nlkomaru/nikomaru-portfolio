import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import CustomCursor from "../components/custom-cursor";
import NoiseOverlay from "../components/noise-overlay";

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
        <section ref={ref} className="relative flex h-screen items-center overflow-hidden">
            <motion.div style={{ y, opacity }} className="relative z-10 w-full px-8 md:px-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >
                    <p
                        className="mb-8 text-[0.5625rem] uppercase tracking-[0.5em] text-gray-500"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Creative Direction & Design
                    </p>
                </motion.div>

                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className="text-[3rem] tracking-tight text-white md:text-[6rem] lg:text-[8rem]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 0.9 }}
                    >
                        Make it
                    </motion.h1>
                </div>
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
                        className="text-[3rem] tracking-tight text-white italic md:text-[6rem] lg:text-[8rem]"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                            lineHeight: 0.9,
                            color: "transparent",
                            WebkitTextStroke: "1px rgba(255,255,255,0.4)",
                        }}
                    >
                        unforgettable
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-12 flex items-center gap-8"
                >
                    <div className="h-px w-16 bg-white/20" />
                    <p
                        className="max-w-xs text-[0.625rem] tracking-wider text-gray-500"
                        style={{ fontFamily: "'Space Mono', monospace", lineHeight: 1.8 }}
                    >
                        Crafting visual narratives at the intersection of art and technology
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute right-8 bottom-10 flex flex-col items-center gap-3 md:right-16"
            >
                <span
                    className="text-[0.5rem] uppercase tracking-[0.3em] text-gray-600"
                    style={{ fontFamily: "'Space Mono', monospace", writingMode: "vertical-rl" }}
                >
                    Scroll
                </span>
                <motion.div
                    animate={{ height: [20, 40, 20] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                    className="w-px bg-white/20"
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
            className="group relative cursor-pointer border-t border-white/5 py-8 md:py-12"
        >
            <div className="flex items-start justify-between px-8 md:px-20">
                <div className="flex items-start gap-6 md:gap-12">
                    <span
                        className="mt-2 hidden text-[0.625rem] text-gray-700 md:block"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                        <h2
                            className="whitespace-pre-line text-[1.5rem] transition-all duration-700 md:text-[2.5rem] lg:text-[3.5rem]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontWeight: 300,
                                lineHeight: 1,
                                color: hovered ? project.color : "#fff",
                            }}
                        >
                            {project.title}
                        </h2>
                        <div className="mt-4 flex items-center gap-4">
                            <span
                                className="text-[0.5625rem] uppercase tracking-[0.3em] transition-colors duration-500"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    color: hovered ? project.color : "#555",
                                }}
                            >
                                {project.category}
                            </span>
                            <span
                                className="text-[0.5625rem] text-gray-700"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                {project.year}
                            </span>
                        </div>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: hovered ? 45 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-2 hidden text-[1.5rem] text-gray-600 md:block"
                >
                    +
                </motion.div>
            </div>

            <motion.div
                initial={false}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9, x: hovered ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute top-1/2 right-8 z-10 w-48 -translate-y-1/2 md:right-20 md:w-64"
            >
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-all duration-700"
                        style={{ filter: hovered ? "grayscale(0%)" : "grayscale(100%)" }}
                    />
                    <div
                        className="absolute inset-0 transition-opacity duration-500"
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
        <div className="overflow-hidden border-y border-white/5 py-16">
            <motion.div
                animate={{ x: [0, -1920] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30, ease: "linear" }}
                className="flex items-center gap-16 whitespace-nowrap"
            >
                {marqueeGroups.map((groupKey) => (
                    <div key={groupKey} className="flex items-center gap-16">
                        {marqueeRows.map((word) => (
                            <span
                                key={`${groupKey}-${word}`}
                                className="text-[1.5rem] tracking-wider md:text-[3rem]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontWeight: 300,
                                    color: "transparent",
                                    WebkitTextStroke: "0.5px rgba(255,255,255,0.1)",
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
        <div className="min-h-screen cursor-none bg-black text-white md:ml-14">
            <CustomCursor />
            <NoiseOverlay />
            <HeroSection />
            <MarqueeSection />

            <section className="py-16 md:py-24">
                <div className="mb-12 px-8 md:px-20">
                    <p
                        className="text-[0.5625rem] uppercase tracking-[0.5em] text-gray-600"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Selected Works
                    </p>
                </div>
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
                <div className="border-t border-white/5" />
            </section>

            <section className="px-8 py-32 text-center md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p
                        className="mb-6 text-[0.5625rem] uppercase tracking-[0.5em] text-gray-600"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Let&apos;s collaborate
                    </p>
                    <h2
                        className="mb-8 text-[2rem] text-white md:text-[4rem]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.1 }}
                    >
                        Have a project
                        <br />
                        <span
                            className="italic"
                            style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}
                        >
                            in mind?
                        </span>
                    </h2>
                    <Link
                        to="/contact"
                        data-hover
                        className="inline-block border border-white/15 px-10 py-4 text-[0.625rem] uppercase tracking-[0.3em] text-gray-400 transition-all duration-700 hover:border-white hover:bg-white hover:text-black"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        Start a conversation
                    </Link>
                </motion.div>
            </section>

            <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/5 px-8 py-8 md:flex-row md:px-20">
                <p
                    className="text-[0.5625rem] tracking-wider text-gray-700"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    &copy; 2026 — All rights reserved
                </p>
                <div className="flex gap-6">
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
                            className="text-[0.5625rem] tracking-wider text-gray-700 transition-colors duration-500 hover:text-white"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {social.label}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}
