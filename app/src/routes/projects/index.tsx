import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { sva } from "styled-system/css";

const serifDisplayStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
} as const;

const monoStyle = {
    fontFamily: "'Space Mono', monospace",
} as const;

const worksPageStyles = sva({
    slots: ["root", "hero", "eyebrow", "title", "list"],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
        },
        hero: {
            px: { base: "8", md: "20" },
            pt: { base: "20", md: "32" },
            pb: "8",
        },
        eyebrow: {
            mb: "4",
            fontSize: "0.5625rem",
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            color: "fg.muted",
        },
        title: {
            fontSize: { base: "2.5rem", md: "5rem" },
            color: "fg.default",
        },
        list: {
            px: { base: "8", md: "12" },
        },
    },
});

const workItemStyles = sva({
    slots: [
        "root",
        "mediaColumn",
        "mediaFrame",
        "mediaImage",
        "mediaOverlay",
        "count",
        "copyColumn",
        "meta",
        "title",
        "description",
        "action",
        "actionLine",
        "actionText",
    ],
    base: {
        root: {
            display: "grid",
            cursor: "pointer",
            gridTemplateColumns: { base: "1fr", md: "repeat(12, minmax(0, 1fr))" },
            alignItems: "center",
            gap: { base: "6", md: "0" },
            py: { base: "12", md: "20" },
        },
        mediaColumn: {
            position: "relative",
            overflow: "hidden",
            gridColumn: { md: "span 6 / span 6" },
        },
        mediaFrame: {
            position: "relative",
            aspectRatio: "4 / 5",
            overflow: "hidden",
        },
        mediaImage: {
            h: "120%",
            w: "full",
            objectFit: "cover",
            transition: "all 1s ease",
        },
        mediaOverlay: {
            position: "absolute",
            inset: 0,
            transition: "all 0.7s ease",
        },
        count: {
            position: "absolute",
            top: "4",
            left: "4",
            fontSize: "0.5rem",
            letterSpacing: "0.3em",
            transition: "color 0.5s ease",
        },
        copyColumn: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gridColumn: { md: "span 5 / span 5" },
        },
        meta: {
            mb: "4",
            fontSize: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            transition: "color 0.5s ease",
        },
        title: {
            fontSize: { base: "1.75rem", md: "2.5rem" },
            transition: "color 0.7s ease",
        },
        description: {
            mt: "4",
            maxW: "sm",
            fontSize: "0.6875rem",
            transition: "color 0.5s ease",
        },
        action: {
            mt: "8",
            display: "flex",
            alignItems: "center",
            gap: "3",
        },
        actionLine: {
            h: "1px",
        },
        actionText: {
            fontSize: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            transition: "color 0.5s ease",
        },
    },
    variants: {
        parity: {
            even: {
                mediaColumn: {
                    gridColumnStart: { md: "1" },
                },
                copyColumn: {
                    gridColumnStart: { md: "8" },
                    pl: { md: "12" },
                    pr: { md: "0" },
                },
            },
            odd: {
                mediaColumn: {
                    gridColumnStart: { md: "7" },
                },
                copyColumn: {
                    gridColumnStart: { md: "1" },
                    pl: { md: "0" },
                    pr: { md: "12" },
                },
            },
        },
    },
});

const works = [
    {
        id: 1,
        slug: "MineAuth",
        title: "MineAuth",
        category: "Project",
        year: "2025",
        color: "#e74c3c",
        image: "https://images.unsplash.com/photo-1769283979195-d418a41ae2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBjb25jcmV0ZXxlbnwxfHx8fDE3NzIxMTQ4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "Authentication toolkit for Minecraft-related apps and services.",
    },
    {
        id: 2,
        slug: "Chlorophyll",
        title: "Chlorophyll",
        category: "Project",
        year: "2025",
        color: "#9b59b6",
        image: "https://images.unsplash.com/photo-1618902410393-6fe0a34bb79e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwZGFyayUyMGN5YmVycHVua3xlbnwxfHx8fDE3NzIxNjA1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "A fast, minimal UI system focusing on clarity and accessibility.",
    },
    {
        id: 3,
        slug: "MoriPath",
        title: "MoriPath",
        category: "Project",
        year: "2025",
        color: "#2ecc71",
        image: "https://images.unsplash.com/photo-1656332694386-3dd2734e63c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNjdWxwdHVyZSUyMG1vZGVybiUyMGFydHxlbnwxfHx8fDE3NzIxNjA1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        description: "A pathfinding/graph toolkit exploring algorithms and visual explanations.",
    },
];

export const Route = createFileRoute("/projects/")({
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
    const styles = workItemStyles({ parity: isEven ? "even" : "odd" });

    return (
        <Link to="/projects/$project" params={{ project: work.slug }}>
            <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={styles.root}
            >
                <div className={styles.mediaColumn} style={{ order: isEven ? 1 : 2 }}>
                    <div className={styles.mediaFrame}>
                        <motion.img
                            src={work.image}
                            alt={work.title}
                            className={styles.mediaImage}
                            style={{ y: imgY, filter: hovered ? "grayscale(0%)" : "grayscale(100%)" }}
                        />
                        <div
                            className={styles.mediaOverlay}
                            style={{
                                background: hovered ? `linear-gradient(135deg, ${work.color}15, transparent)` : "none",
                            }}
                        />
                    </div>

                    <div
                        className={styles.count}
                        style={{
                            ...monoStyle,
                            color: hovered ? work.color : "rgba(31,41,55,0.4)",
                        }}
                    >
                        {String(index + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
                    </div>
                </div>

                <div className={styles.copyColumn} style={{ order: isEven ? 2 : 1 }}>
                    <span
                        className={styles.meta}
                        style={{
                            ...monoStyle,
                            color: hovered ? work.color : "var(--colors-fg-muted)",
                        }}
                    >
                        {work.category} - {work.year}
                    </span>

                    <h2
                        className={styles.title}
                        style={{
                            ...serifDisplayStyle,
                            lineHeight: 1.1,
                            color: hovered ? "var(--colors-fg-default)" : "rgba(31,41,55,0.7)",
                        }}
                    >
                        {work.title}
                    </h2>

                    <p
                        className={styles.description}
                        style={{
                            ...monoStyle,
                            lineHeight: 1.8,
                            color: hovered ? "rgba(31,41,55,0.7)" : "rgba(31,41,55,0.45)",
                        }}
                    >
                        {work.description}
                    </p>

                    <div className={styles.action}>
                        <motion.div
                            animate={{ width: hovered ? 48 : 24 }}
                            transition={{ duration: 0.5 }}
                            className={styles.actionLine}
                            style={{ backgroundColor: hovered ? work.color : "rgba(31,41,55,0.16)" }}
                        />
                        <span
                            className={styles.actionText}
                            style={{
                                ...monoStyle,
                                color: hovered ? work.color : "rgba(31,41,55,0.45)",
                            }}
                        >
                            View project
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

function WorksPage() {
    const styles = worksPageStyles();

    return (
        <div className={styles.root}>
            <section className={styles.hero}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className={styles.eyebrow} style={monoStyle}>
                        Archive - {works.length} Projects
                    </p>
                    <h1
                        className={styles.title}
                        style={{
                            ...serifDisplayStyle,
                            lineHeight: 1,
                        }}
                    >
                        Works
                    </h1>
                </motion.div>
            </section>

            <section className={styles.list}>
                {works.map((work, index) => (
                    <WorkItem key={work.id} work={work} index={index} />
                ))}
            </section>
        </div>
    );
}
