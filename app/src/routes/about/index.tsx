import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { css } from "styled-system/css";

export const Route = createFileRoute("/about/")({
    component: AboutPage,
});

function AboutPage() {
    return (
        <div
            className={css({
                minH: "100vh",
                bg: "bg.canvas",
                px: { base: "8", md: "20" },
                pt: { base: "24", md: "28" },
                pb: "20",
                color: "fg.default",
            })}
        >
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={css({
                    mb: "4",
                    fontSize: "0.625rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.45em",
                    color: "fg.muted",
                })}
            >
                About
            </motion.p>

            <section
                className={css({
                    display: "grid",
                    gap: "10",
                    gridTemplateColumns: { md: "repeat(12, minmax(0, 1fr))" },
                })}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={css({ gridColumn: { md: "span 5 / span 5" } })}
                >
                    <div
                        className={css({
                            aspectRatio: "3 / 4",
                            borderWidth: "1px",
                            borderColor: "border.default",
                            bg: "bg.default",
                            p: "6",
                            boxShadow: "sm",
                        })}
                    >
                        <p
                            className={css({
                                fontSize: "xs",
                                textTransform: "uppercase",
                                letterSpacing: "0.3em",
                                color: "fg.muted",
                            })}
                        >
                            Nikomaru
                        </p>
                        <p className={css({ mt: "4", fontSize: "sm", lineHeight: "7", color: "fg.subtle" })}>
                            Web engineer focused on making polished products that are simple to maintain.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={css({ gridColumn: { md: "span 7 / span 7" } })}
                >
                    <h1 className={css({ fontSize: { base: "2rem", md: "3.5rem" }, lineHeight: 1.1 })}>
                        Design like an artist,
                        <br />
                        <span
                            className={css({ fontStyle: "italic" })}
                            style={{ color: "transparent", WebkitTextStroke: "1px rgba(31,41,55,0.45)" }}
                        >
                            ship like an engineer
                        </span>
                    </h1>
                    <p className={css({ mt: "8", maxW: "2xl", fontSize: "sm", lineHeight: "8", color: "fg.subtle" })}>
                        I enjoy translating rough ideas into maintainable code. I care about visual quality, clean
                        component boundaries, and pragmatic delivery speed.
                    </p>

                    <div className={css({ mt: "10", display: "flex", flexWrap: "wrap", gap: "3" })}>
                        {["TypeScript", "React", "TanStack Start", "Cloudflare Workers", "Hono", "Storybook"].map(
                            (skill) => (
                                <span
                                    key={skill}
                                    className={css({
                                        borderWidth: "1px",
                                        borderColor: "border.default",
                                        bg: "bg.default",
                                        px: "4",
                                        py: "2",
                                        fontSize: "xs",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.25em",
                                        color: "fg.subtle",
                                    })}
                                >
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
