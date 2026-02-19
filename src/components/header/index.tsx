import { Link } from "@tanstack/react-router";
import { Presentation } from "lucide-react";

export default function Header() {
    return (
        <header className="border-b border-gray-200 py-4 px-6">
            <nav className="max-w-6xl mx-auto flex items-center gap-6">
                <Link to="/" className="text-lg font-bold">
                    nikomaru.dev
                </Link>
                <div className="flex gap-4">
                    <Link
                        to="/slides"
                        className="flex items-center gap-1.5 text-sm hover:text-blue-600 transition-colors"
                    >
                        <Presentation className="w-4 h-4" />
                        スライド
                    </Link>
                </div>
            </nav>
        </header>
    );
}
