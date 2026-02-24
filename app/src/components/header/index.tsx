import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Presentation } from "lucide-react";
import { m } from "../../paraglide/messages";
import { deLocalizeHref, getLocale, localizeHref, setLocale } from "../../paraglide/runtime";

export default function Header() {
    const routerState = useRouterState();
    const locale = getLocale();
    const targetLocale = locale === "ja" ? "en" : "ja";
    const currentHref = `${routerState.location.pathname}${routerState.location.searchStr ?? ""}${routerState.location.hash}`;
    const baseHref = deLocalizeHref(currentHref);
    const targetHref = localizeHref(baseHref, { locale: targetLocale });

    return (
        <header className="border-b border-gray-200 py-4 px-6">
            <nav className="max-w-6xl mx-auto flex items-center gap-6">
                <Link to="/" className="text-lg font-bold">
                    nikomaru.dev
                </Link>
                <div className="flex gap-4 items-center">
                    <Link
                        to="/slides"
                        className="flex items-center gap-1.5 text-sm hover:text-blue-600 transition-colors"
                    >
                        <Presentation className="w-4 h-4" />
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={m.navSlides()}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                            >
                                {m.navSlides()}
                            </motion.span>
                        </AnimatePresence>
                    </Link>
                </div>
                <div className="ml-auto flex items-center gap-3 text-sm">
                    <span className="text-gray-500">{m.languageLabel()}</span>
                    <a
                        href={targetHref}
                        onClick={(event) => {
                            event.preventDefault();
                            setLocale(targetLocale);
                        }}
                        className="rounded-full border border-gray-200 px-3 py-1 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={targetLocale}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                            >
                                {targetLocale === "ja" ? m.languageSwitchToJa() : m.languageSwitchToEn()}
                            </motion.span>
                        </AnimatePresence>
                    </a>
                </div>
            </nav>
        </header>
    );
}
