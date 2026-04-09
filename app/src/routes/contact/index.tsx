import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { sva } from "styled-system/css";
import { m } from "../../paraglide/messages";

const contactPageStyles = sva({
    slots: [
        "root",
        "eyebrow",
        "title",
        "grid",
        "content",
        "email",
        "srOnly",
        "summaryWrap",
        "summary",
        "aside",
        "asideBlock",
        "asideLabel",
        "locationText",
        "locationSub",
        "socialList",
    ],
    base: {
        root: {
            minH: "100vh",
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
        title: {
            fontSize: { base: "2.5rem", md: "4.5rem" },
            color: "fg.default",
        },
        grid: {
            mt: "12",
            display: "grid",
            gap: "16",
            gridTemplateColumns: { md: "repeat(12, minmax(0, 1fr))" },
        },
        content: {
            gridColumn: { md: "span 7 / span 7" },
        },
        email: {
            fontSize: { base: "1.25rem", md: "2rem" },
            color: "fg.subtle",
            transition: "color 0.7s ease",
            _hover: {
                color: "fg.default",
            },
        },
        srOnly: {
            position: "absolute",
            w: "1px",
            h: "1px",
            p: 0,
            m: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
        },
        summaryWrap: {
            mt: "10",
            borderTopWidth: "1px",
            borderColor: "border.subtle",
            pt: "8",
        },
        summary: {
            maxW: "xl",
            fontSize: "0.6875rem",
            lineHeight: "8",
            color: "fg.muted",
        },
        aside: {
            gridColumn: { md: "span 5 / span 5" },
        },
        asideBlock: {
            mb: "16",
        },
        asideLabel: {
            mb: "6",
            fontSize: "0.5625rem",
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            color: "fg.muted",
        },
        locationText: {
            fontSize: "1rem",
            color: "fg.subtle",
        },
        locationSub: {
            color: "fg.muted",
        },
        socialList: {},
    },
});

const socialLinkStyles = sva({
    slots: ["link", "name", "handle"],
    base: {
        link: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: "1px",
            borderColor: "border.subtle",
            py: "4",
            transition: "all 0.5s ease",
        },
        name: {
            fontSize: "0.6875rem",
            transition: "color 0.5s ease",
        },
        handle: {
            fontSize: "0.5625rem",
            transition: "all 0.5s ease",
        },
    },
});

export const Route = createFileRoute("/contact/")({
    component: ContactPage,
});

const socialLinks = [
    { name: "Twitter", handle: "@nlkomaru", color: "#1da1f2", href: "https://x.com/nikomaru0102" },
    { name: "GitHub", handle: "nlkomaru", color: "#9ca3af", href: "https://github.com/nlkomaru" },
];

function ContactPage() {
    const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
    const styles = contactPageStyles();

    return (
        <div className={styles.root}>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={styles.eyebrow}>
                Contact
            </motion.p>
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.title}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
                {m["contact.heading"]()}
            </motion.h1>

            <div className={styles.grid}>
                <section className={styles.content}>
                    <p
                        data-hover
                        className={`${styles.email} mail-obfuscated`}
                        data-user="recruit"
                        data-domain="nikomaru.dev"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                        }}
                    >
                        <span className={styles.srOnly}>recruit@nikomaru.dev</span>
                    </p>

                    <div className={styles.summaryWrap}>
                        <p className={styles.summary} style={{ fontFamily: "'Space Mono', monospace" }}>
                            {m["contact.summary"]()}
                        </p>
                    </div>
                </section>

                <aside className={styles.aside}>
                    <div className={styles.asideBlock}>
                        <p className={styles.asideLabel} style={{ fontFamily: "'Space Mono', monospace" }}>
                            {m["contact.basedIn"]()}
                        </p>
                        <p
                            className={styles.locationText}
                            style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.8 }}
                        >
                            {m["contact.location"]()}
                            <br />
                            <span className={styles.locationSub}>{m["contact.locationSub"]()}</span>
                        </p>
                    </div>

                    <div className={styles.asideBlock}>
                        <p className={styles.asideLabel} style={{ fontFamily: "'Space Mono', monospace" }}>
                            {m["contact.social"]()}
                        </p>
                        <div className={styles.socialList}>
                            {socialLinks.map((social) => {
                                const isHovered = hoveredSocial === social.name;
                                const socialStyles = socialLinkStyles();

                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        data-hover
                                        onMouseEnter={() => setHoveredSocial(social.name)}
                                        onMouseLeave={() => setHoveredSocial(null)}
                                        className={socialStyles.link}
                                    >
                                        <span
                                            className={socialStyles.name}
                                            style={{
                                                fontFamily: "'Space Mono', monospace",
                                                color: isHovered ? social.color : "var(--colors-fg-muted)",
                                            }}
                                        >
                                            {social.name}
                                        </span>
                                        <span
                                            className={socialStyles.handle}
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
