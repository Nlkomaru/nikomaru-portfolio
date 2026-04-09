import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { sva } from "styled-system/css";
import CustomCursor from "../components/custom-cursor";
import NoiseOverlay from "../components/noise-overlay";
import { Button } from "../components/ui";

const serifDisplayStyle = {
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 300,
} as const;

const monoStyle = {
    fontFamily: '"Space Mono", monospace',
} as const;

const heroSectionStyles = sva({
    slots: [
        "root",
        "content",
        "eyebrow",
        "titleMask",
        "title",
        "accentTitle",
        "subcopy",
        "subcopyRule",
        "subcopyText",
        "scrollIndicator",
        "scrollLabel",
        "scrollLine",
    ],
    base: {
        root: {
            position: "relative",
            display: "flex",
            h: "100vh",
            alignItems: "center",
            overflow: "hidden",
        },
        content: {
            position: "relative",
            zIndex: 10,
            w: "full",
            px: { base: "8", md: "20" },
        },
        eyebrow: {
            mb: "8",
            fontSize: "0.5625rem",
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            color: "fg.muted",
        },
        titleMask: {
            overflow: "hidden",
        },
        title: {
            fontSize: { base: "3rem", md: "6rem", lg: "8rem" },
            letterSpacing: "-0.03em",
            color: "fg.default",
        },
        accentTitle: {
            fontSize: { base: "3rem", md: "6rem", lg: "8rem" },
            letterSpacing: "-0.03em",
            fontStyle: "italic",
        },
        subcopy: {
            mt: "12",
            display: "flex",
            alignItems: "center",
            gap: "8",
        },
        subcopyRule: {
            h: "1px",
            w: "16",
            bg: "border.default",
        },
        subcopyText: {
            maxW: "xs",
            fontSize: "0.625rem",
            letterSpacing: "0.08em",
            color: "fg.muted",
        },
        scrollIndicator: {
            position: "absolute",
            right: { base: "8", md: "16" },
            bottom: "10",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3",
        },
        scrollLabel: {
            fontSize: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "fg.subtle",
        },
        scrollLine: {
            w: "1px",
            bg: "border.default",
        },
    },
});

const projectCardStyles = sva({
    slots: [
        "root",
        "content",
        "leading",
        "index",
        "title",
        "meta",
        "category",
        "year",
        "plus",
        "preview",
        "previewFrame",
        "previewImage",
        "previewOverlay",
    ],
    base: {
        root: {
            position: "relative",
            cursor: "pointer",
            borderTopWidth: "1px",
            borderColor: "border.subtle",
            py: { base: "8", md: "12" },
        },
        content: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            px: { base: "8", md: "20" },
        },
        leading: {
            display: "flex",
            alignItems: "flex-start",
            gap: { base: "6", md: "12" },
        },
        index: {
            mt: "2",
            display: { base: "none", md: "block" },
            fontSize: "0.625rem",
            color: "fg.muted",
        },
        title: {
            whiteSpace: "pre-line",
            fontSize: { base: "1.5rem", md: "2.5rem", lg: "3.5rem" },
            transition: "all 0.7s ease",
        },
        meta: {
            mt: "4",
            display: "flex",
            alignItems: "center",
            gap: "4",
        },
        category: {
            fontSize: "0.5625rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            transition: "color 0.5s ease",
        },
        year: {
            fontSize: "0.5625rem",
            color: "fg.muted",
        },
        plus: {
            mt: "2",
            display: { base: "none", md: "block" },
            fontSize: "1.5rem",
            color: "fg.subtle",
        },
        preview: {
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            right: { base: "8", md: "20" },
            zIndex: 10,
            display: { base: "none", md: "block" },
            w: { md: "48", lg: "64" },
            transform: "translateY(-50%)",
        },
        previewFrame: {
            position: "relative",
            aspectRatio: "3 / 4",
            overflow: "hidden",
            borderRadius: "l3",
            boxShadow: "md",
        },
        previewImage: {
            h: "full",
            w: "full",
            objectFit: "cover",
            transition: "all 0.7s ease",
        },
        previewOverlay: {
            position: "absolute",
            inset: 0,
            transition: "opacity 0.5s ease",
        },
    },
});

const marqueeSectionStyles = sva({
    slots: ["root", "track", "group", "word"],
    base: {
        root: {
            overflow: "hidden",
            borderTopWidth: "1px",
            borderBottomWidth: "1px",
            borderColor: "border.subtle",
            py: "16",
        },
        track: {
            display: "flex",
            alignItems: "center",
            gap: "16",
            whiteSpace: "nowrap",
        },
        group: {
            display: "flex",
            alignItems: "center",
            gap: "16",
        },
        word: {
            fontSize: { base: "1.5rem", md: "3rem" },
            letterSpacing: "0.05em",
        },
    },
});

const homePageStyles = sva({
    slots: [
        "root",
        "worksSection",
        "worksIntro",
        "worksEyebrow",
        "worksDivider",
        "ctaSection",
        "ctaEyebrow",
        "ctaTitle",
        "ctaButton",
        "footer",
        "footerCopy",
        "footerLinks",
        "footerLink",
    ],
    base: {
        root: {
            minH: "100vh",
            cursor: "none",
            bg: "bg.canvas",
            color: "fg.default",
        },
        worksSection: {
            py: { base: "16", md: "24" },
        },
        worksIntro: {
            mb: "12",
            px: { base: "8", md: "20" },
        },
        worksEyebrow: {
            fontSize: "0.5625rem",
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            color: "fg.muted",
        },
        worksDivider: {
            borderTopWidth: "1px",
            borderColor: "border.subtle",
        },
        ctaSection: {
            px: { base: "8", md: "20" },
            py: "32",
            textAlign: "center",
        },
        ctaEyebrow: {
            mb: "6",
            fontSize: "0.5625rem",
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            color: "fg.muted",
        },
        ctaTitle: {
            mb: "8",
            fontSize: { base: "2rem", md: "4rem" },
            color: "fg.default",
        },
        ctaButton: {
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            fontFamily: '"Space Mono", monospace',
        },
        footer: {
            display: "flex",
            flexDirection: { base: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4",
            borderTopWidth: "1px",
            borderColor: "border.subtle",
            px: { base: "8", md: "20" },
            py: "8",
        },
        footerCopy: {
            fontSize: "0.5625rem",
            letterSpacing: "0.08em",
            color: "fg.muted",
        },
        footerLinks: {
            display: "flex",
            gap: "6",
        },
        footerLink: {
            fontSize: "0.5625rem",
            letterSpacing: "0.08em",
            color: "fg.muted",
            transition: "color 0.5s ease",
            _hover: {
                color: "fg.default",
            },
        },
    },
});

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
    const styles = heroSectionStyles();

    return (
        <section ref={ref} className={styles.root}>
            <motion.div style={{ y, opacity }} className={styles.content}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >
                    <p className={styles.eyebrow} style={monoStyle}>
                        Creative Direction & Design
                    </p>
                </motion.div>

                <div className={styles.titleMask}>
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        className={styles.title}
                        style={{
                            ...serifDisplayStyle,
                            lineHeight: 0.9,
                        }}
                    >
                        Make it
                    </motion.h1>
                </div>
                <div className={styles.titleMask}>
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
                        className={styles.accentTitle}
                        style={{
                            ...serifDisplayStyle,
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
                    className={styles.subcopy}
                >
                    <div className={styles.subcopyRule} />
                    <p className={styles.subcopyText} style={{ ...monoStyle, lineHeight: 1.8 }}>
                        Crafting visual narratives at the intersection of art and technology
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className={styles.scrollIndicator}
            >
                <span className={styles.scrollLabel} style={{ ...monoStyle, writingMode: "vertical-rl" }}>
                    Scroll
                </span>
                <motion.div
                    animate={{ height: [20, 40, 20] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
                    className={styles.scrollLine}
                />
            </motion.div>
        </section>
    );
}

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const styles = projectCardStyles();

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
            className={styles.root}
        >
            <div className={styles.content}>
                <div className={styles.leading}>
                    <span className={styles.index} style={monoStyle}>
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                        <h2
                            className={styles.title}
                            style={{
                                ...serifDisplayStyle,
                                lineHeight: 1,
                                color: hovered ? project.color : "var(--colors-fg-default)",
                            }}
                        >
                            {project.title}
                        </h2>
                        <div className={styles.meta}>
                            <span
                                className={styles.category}
                                style={{
                                    ...monoStyle,
                                    color: hovered ? project.color : "var(--colors-fg-muted)",
                                }}
                            >
                                {project.category}
                            </span>
                            <span className={styles.year} style={monoStyle}>
                                {project.year}
                            </span>
                        </div>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: hovered ? 45 : 0 }}
                    transition={{ duration: 0.4 }}
                    className={styles.plus}
                >
                    +
                </motion.div>
            </div>

            <motion.div
                initial={false}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9, x: hovered ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className={styles.preview}
            >
                <div className={styles.previewFrame}>
                    <img
                        src={project.image}
                        alt={project.title}
                        className={styles.previewImage}
                        style={{ filter: hovered ? "grayscale(0%)" : "grayscale(100%)" }}
                    />
                    <div
                        className={styles.previewOverlay}
                        style={{
                            backgroundColor: project.color,
                            opacity: hovered ? 0.1 : 0,
                            mixBlendMode: "overlay",
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

function MarqueeSection() {
    const marqueeRows = ["DESIGN", "DEVELOP", "CREATE", "INSPIRE", "INNOVATE", "EXPLORE"];
    const marqueeGroups = ["group-1", "group-2", "group-3"];
    const styles = marqueeSectionStyles();

    return (
        <div className={styles.root}>
            <motion.div
                animate={{ x: [0, -1920] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30, ease: "linear" }}
                className={styles.track}
            >
                {marqueeGroups.map((groupKey) => (
                    <div key={groupKey} className={styles.group}>
                        {marqueeRows.map((word) => (
                            <span
                                key={`${groupKey}-${word}`}
                                className={styles.word}
                                style={{
                                    ...serifDisplayStyle,
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
    const styles = homePageStyles();

    return (
        <div className={styles.root}>
            <CustomCursor />
            <NoiseOverlay />
            <HeroSection />
            <MarqueeSection />

            <section className={styles.worksSection}>
                <div className={styles.worksIntro}>
                    <p className={styles.worksEyebrow} style={monoStyle}>
                        Selected Works
                    </p>
                </div>
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
                <div className={styles.worksDivider} />
            </section>

            <section className={styles.ctaSection}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className={styles.ctaEyebrow} style={monoStyle}>
                        Let&apos;s collaborate
                    </p>
                    <h2
                        className={styles.ctaTitle}
                        style={{
                            ...serifDisplayStyle,
                            lineHeight: 1.1,
                        }}
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
                    <Button as={Link} to="/contact" data-hover variant="outline" size="lg" className={styles.ctaButton}>
                        Start a conversation
                    </Button>
                </motion.div>
            </section>

            <footer className={styles.footer}>
                <p className={styles.footerCopy} style={monoStyle}>
                    &copy; 2026 — All rights reserved
                </p>
                <div className={styles.footerLinks}>
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
                            className={styles.footerLink}
                            style={monoStyle}
                        >
                            {social.label}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}
