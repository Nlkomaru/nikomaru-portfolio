import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { css } from "styled-system/css";
import { m } from "../../paraglide/messages";

export const Route = createFileRoute("/contact/")({
    component: ContactPage,
});

const socialLinks = [
    { name: "Twitter", handle: "@nlkomaru", color: "#1da1f2", href: "https://x.com/nikomaru0102" },
    { name: "GitHub", handle: "nlkomaru", color: "#9ca3af", href: "https://github.com/nlkomaru" },
];

function ContactPage() {
    const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

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
                Contact
            </motion.p>
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={css({ fontSize: { base: "2.5rem", md: "4.5rem" }, color: "fg.default" })}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
                {m["contact.heading"]()}
            </motion.h1>

            <div
                className={css({
                    mt: "12",
                    display: "grid",
                    gap: "16",
                    gridTemplateColumns: { md: "repeat(12, minmax(0, 1fr))" },
                })}
            >
                <section className={css({ gridColumn: { md: "span 7 / span 7" } })}>
                    <p
                        data-hover
                        className={css({
                            fontSize: { base: "1.25rem", md: "2rem" },
                            color: "fg.subtle",
                            transition: "color 0.7s ease",
                            _hover: {
                                color: "fg.default",
                            },
                        })}
                        data-user="recruit"
                        data-domain="nikomaru.dev"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                width: "1px",
                                height: "1px",
                                padding: 0,
                                margin: "-1px",
                                overflow: "hidden",
                                clip: "rect(0, 0, 0, 0)",
                                whiteSpace: "nowrap",
                                border: 0,
                            }}
                        >
                            recruit@nikomaru.dev
                        </span>
                    </p>

                    <div className={css({ mt: "10", borderTopWidth: "1px", borderColor: "border.subtle", pt: "8" })}>
                        <p
                            className={css({ maxW: "xl", fontSize: "0.6875rem", lineHeight: "8", color: "fg.muted" })}
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {m["contact.summary"]()}
                        </p>
                    </div>
                </section>

                <aside className={css({ gridColumn: { md: "span 5 / span 5" } })}>
                    <div className={css({ mb: "16" })}>
                        <p
                            className={css({
                                mb: "6",
                                fontSize: "0.5625rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5em",
                                color: "fg.muted",
                            })}
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {m["contact.basedIn"]()}
                        </p>
                        <p
                            className={css({ fontSize: "1rem", color: "fg.subtle" })}
                            style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.8 }}
                        >
                            {m["contact.location"]()}
                            <br />
                            <span className={css({ color: "fg.muted" })}>{m["contact.locationSub"]()}</span>
                        </p>
                    </div>

                    <div className={css({ mb: "16" })}>
                        <p
                            className={css({
                                mb: "6",
                                fontSize: "0.5625rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.5em",
                                color: "fg.muted",
                            })}
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {m["contact.social"]()}
                        </p>
                        <div>
                            {socialLinks.map((social) => {
                                const isHovered = hoveredSocial === social.name;

                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        data-hover
                                        onMouseEnter={() => setHoveredSocial(social.name)}
                                        onMouseLeave={() => setHoveredSocial(null)}
                                        className={css({
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: "1px",
                                            borderColor: "border.subtle",
                                            py: "4",
                                            transition: "all 0.5s ease",
                                        })}
                                    >
                                        <span
                                            className={css({ fontSize: "0.6875rem", transition: "color 0.5s ease" })}
                                            style={{
                                                fontFamily: "'Space Mono', monospace",
                                                color: isHovered ? social.color : "var(--colors-fg-muted)",
                                            }}
                                        >
                                            {social.name}
                                        </span>
                                        <span
                                            className={css({ fontSize: "0.5625rem", transition: "all 0.5s ease" })}
                                            style={{
                                                fontFamily: "'Space Mono', monospace",
                                                color: isHovered ? "rgba(31,41,55,0.55)" : "rgba(31,41,55,0.25)",
                                            }}
                                        >
                                            {social.handle}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
