import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about/")({
    component: AboutPage,
});

function AboutPage() {
    return (
        <div className="min-h-screen bg-black px-8 pt-24 pb-20 text-white md:ml-14 md:px-20 md:pt-28">
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-[0.625rem] uppercase tracking-[0.45em] text-gray-500"
            >
                About
            </motion.p>

            <section className="grid gap-10 md:grid-cols-12">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-5">
                    <div className="aspect-[3/4] border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Nikomaru</p>
                        <p className="mt-4 text-sm leading-7 text-gray-400">
                            Web engineer focused on making polished products that are simple to maintain.
                        </p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-7">
                    <h1 className="text-[2rem] leading-tight md:text-[3.5rem]">
                        Design like an artist,
                        <br />
                        <span
                            className="text-transparent italic"
                            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}
                        >
                            ship like an engineer
                        </span>
                    </h1>
                    <p className="mt-8 max-w-2xl text-sm leading-8 text-gray-400">
                        I enjoy translating rough ideas into maintainable code. I care about visual quality, clean
                        component boundaries, and pragmatic delivery speed.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-3">
                        {["TypeScript", "React", "TanStack Start", "Cloudflare Workers", "Hono", "Storybook"].map(
                            (skill) => (
                                <span
                                    key={skill}
                                    className="border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-gray-400"
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
