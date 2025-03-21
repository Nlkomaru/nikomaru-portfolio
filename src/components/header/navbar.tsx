"use client";
import { css } from "@/styled-system/css";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkStyle = css({});
const activeLinkStyle = css({
    //underline
    textDecoration: "underline",
    textDecorationColor: "var(--colors-color-palette-8)",
    textDecorationThickness: "2px",
    textDecorationStyle: "solid",
    //under 8px
    textUnderlineOffset: "6px",
});

export const Navbar = () => {
    const currentPath = usePathname();

    const data = [
        // { url: "/blog", name: "書いたぶろぐ", label: "Blog" },
        { url: "/slides", name: "スライド", label: "Slides" },
        // { url: "/works", name: "作ったもの", label: "Works" },
        { url: "/about-me", name: "私について", label: "About Me" },
    ];

    return (
        <div
            className={css({
                display: "flex",
                padding: "8px",
                justifyContent: "center",
                alignItems: "center",
                gap: "64px",
            })}
        >
            {data.map((item) => (
                <Link
                    key={item.url}
                    href={item.url}
                    className={
                        currentPath === item.url ? activeLinkStyle : linkStyle
                    }
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
};
