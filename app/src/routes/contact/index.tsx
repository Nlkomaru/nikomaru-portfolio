import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
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
        <div className="min-h-screen bg-black px-8 pt-24 pb-20 text-white md:ml-14 md:px-20 md:pt-28">
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-[0.625rem] uppercase tracking-[0.45em] text-gray-500"
            >
                Contact
            </motion.p>
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[2.5rem] md:text-[4.5rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
                {m["contact.heading"]()}
            </motion.h1>

            <div className="mt-12 grid gap-16 md:grid-cols-12">
                <section className="md:col-span-7">
                    <p
                        data-hover
                        className="mail-obfuscated text-[1.25rem] text-white/40 transition-colors duration-700 hover:text-white md:text-[2rem]"
                        data-user="recruit"
                        data-domain="nikomaru.dev"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                        }}
                    >
                        <span className="sr-only"
                        >recruit@nikomaru.dev</span>
                    </p>

                    <div className="mt-10 border-t border-white/5 pt-8">
                        <p
                            className="max-w-xl text-[0.6875rem] leading-8 text-gray-500"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {m["contact.summary"]()}
                        </p>
                    </div>
                </section>

                <aside className="md:col-span-5">
                    <div className="mb-16">
                        <p
                            className="mb-6 text-[0.5625rem] uppercase tracking-[0.5em] text-gray-600"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {m["contact.basedIn"]()}
                        </p>
                        <p
                            className="text-[1rem] text-white/60"
                            style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.8 }}
                        >
                            {m["contact.location"]()}
                            <br />
                            <span className="text-white/30">{m["contact.locationSub"]()}</span>
                        </p>
                    </div>

                    <div className="mb-16">
                        <p
                            className="mb-6 text-[0.5625rem] uppercase tracking-[0.5em] text-gray-600"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            {m["contact.social"]()}
                        </p>
                        <div className="space-y-0">
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
                                        className="group flex items-center justify-between border-b border-white/5 py-4 transition-all duration-500"
                                    >
                                        <span
                                            className="text-[0.6875rem] transition-colors duration-500"
                                            style={{
                                                fontFamily: "'Space Mono', monospace",
                                                color: isHovered ? social.color : "#444",
                                            }}
                                        >
                                            {social.name}
                                        </span>
                                        <span
                                            className="text-[0.5625rem] transition-all duration-500"
                                            style={{
                                                fontFamily: "'Space Mono', monospace",
                                                color: isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)",
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
