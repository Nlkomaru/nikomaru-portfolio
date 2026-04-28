import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { sva } from "styled-system/css";

const aboutPageStyles = sva({
    slots: [
        "root",
        "eyebrow",
        "grid",
        "profileColumn",
        "profileCard",
        "profileName",
        "profileSummary",
        "copyColumn",
        "title",
        "titleAccent",
        "description",
        "skills",
        "skillPill",
    ],
    base: {
        root: {
            minH: { base: "calc(100dvh - 3.5rem)", md: "100dvh" },
            bg: "bg.canvas",
            px: { base: "8", md: "20" },
            pt: { base: "24", md: "28" },
            pb: "20",
            color: "fg.default",
        },
        eyebrow: {
            mb: "4",
            fontSize: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.45em",
            color: "fg.muted",
        },
        grid: {
            display: "grid",
            gap: "10",
            gridTemplateColumns: { md: "repeat(12, minmax(0, 1fr))" },
        },
        profileColumn: {
            gridColumn: { md: "span 5 / span 5" },
        },
        profileCard: {
            aspectRatio: "3 / 4",
            borderWidth: "1px",
            borderColor: "border.default",
            bg: "bg.default",
            p: "6",
            boxShadow: "sm",
        },
        profileName: {
            fontSize: "xs",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "fg.muted",
        },
        profileSummary: {
            mt: "4",
            fontSize: "sm",
            lineHeight: "7",
            color: "fg.subtle",
        },
        copyColumn: {
            gridColumn: { md: "span 7 / span 7" },
        },
        title: {
            fontSize: { base: "2rem", md: "3.5rem" },
            lineHeight: 1.1,
        },
        titleAccent: {
            fontStyle: "italic",
        },
        description: {
            mt: "8",
            maxW: "2xl",
            fontSize: "sm",
            lineHeight: "8",
            color: "fg.subtle",
        },
        skills: {
            mt: "10",
            display: "flex",
            flexWrap: "wrap",
            gap: "3",
        },
        skillPill: {
            borderWidth: "1px",
            borderColor: "border.default",
            bg: "bg.default",
            px: "4",
            py: "2",
            fontSize: "xs",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "fg.subtle",
        },
    },
});

export const Route = createFileRoute("/about/")({
    component: AboutPage,
});

function AboutPage() {
    const styles = aboutPageStyles();

    return (
        <div className={styles.root}>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={styles.eyebrow}>
                About
            </motion.p>

            <section className={styles.grid}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.profileColumn}>
                    <div className={styles.profileCard}>
                        <p className={styles.profileName}>Nikomaru</p>
                        <p className={styles.profileSummary}>
                            Web engineer focused on making polished products that are simple to maintain.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={styles.copyColumn}
                >
                    <h1 className={styles.title}>
                        Design like an artist,
                        <br />
                        <span
                            className={styles.titleAccent}
                            style={{ color: "transparent", WebkitTextStroke: "1px rgba(31,41,55,0.45)" }}
                        >
                            ship like an engineer
                        </span>
                    </h1>
                    <p className={styles.description}>
                        I enjoy translating rough ideas into maintainable code. I care about visual quality, clean
                        component boundaries, and pragmatic delivery speed.
                    </p>

                    <div className={styles.skills}>
                        {["TypeScript", "React", "TanStack Start", "Cloudflare Workers", "Hono", "Storybook"].map(
                            (skill) => (
                                <span key={skill} className={styles.skillPill}>
                                    {skill}
                                </span>
                            ),
                        )}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
