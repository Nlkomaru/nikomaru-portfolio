import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { deLocalizeHref, getLocale, setLocale } from "../../paraglide/runtime";

export default function Header() {
    const routerState = useRouterState();
    const locale = getLocale();
    const targetLocale = locale === "ja" ? "en" : "ja";
    const basePathname = deLocalizeHref(routerState.location.pathname);
    const localeSearch = { ...routerState.location.search, __locale: targetLocale };
    const currentPath = deLocalizeHref(routerState.location.pathname);
    const navItems = [
        { label: "Index", to: "/" },
        { label: "Works", to: "/works" },
        { label: "Talks", to: "/talks" },
        { label: "About", to: "/about" },
        { label: "Pictures", to: "/pictures" },
        { label: "Contact", to: "/contact" },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 z-50 hidden h-screen w-14 flex-col items-center justify-between border-r border-white/10 bg-black py-6 md:flex">
                <Link
                    to="/"
                    className="text-[0.625rem] uppercase tracking-[0.3em] text-white"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    NIKOMARU 
                    <br />
                    PORTFOLIO
                </Link>

                <div className="flex flex-col items-center gap-6">
                    {navItems.map((item, index) => {
                        const isActive = currentPath === item.to;

                        return (
                            <Link key={item.to} to={item.to} className="group relative">
                                <div
                                    className="h-2 w-2 rounded-full transition-all duration-500"
                                    style={{
                                        backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.2)",
                                        transform: isActive ? "scale(1.3)" : "scale(1)",
                                    }}
                                />
                                <span className="absolute top-1/2 left-6 -translate-y-1/2 whitespace-nowrap text-[0.5625rem] uppercase tracking-[0.25em] text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    {String(index + 1).padStart(2, "0")}—{item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <Link
                    to={basePathname}
                    search={localeSearch}
                    hash={routerState.location.hash}
                    onClick={() => setLocale(targetLocale, { reload: false })}
                    className="text-[0.7rem] tracking-[0.2em] text-gray-500"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={targetLocale}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            {targetLocale.toUpperCase()}
                        </motion.span>
                    </AnimatePresence>
                </Link>
            </nav>
            <div className="fixed top-0 left-0 z-40 h-14 w-full border-b border-white/10 bg-black md:hidden" />
        </>
    );
}
