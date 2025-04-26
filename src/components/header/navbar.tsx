"use client";
import { css } from "@/styled-system/css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "~/lib/constants/urls";

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
            {NAVIGATION_ITEMS.map((item) => (
                <Link
                    key={item.url}
                    href={item.url}
                    className={
                        currentPath.startsWith(item.url)
                            ? activeLinkStyle
                            : linkStyle
                    }
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
};
