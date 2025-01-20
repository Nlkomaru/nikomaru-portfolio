import { css } from "@/styled-system/css";
import Link from "next/link";

const linkStyle = css({});

export const Navbar = () => {
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
            <Link href={"/slides"} className={linkStyle}>
                スライド
            </Link>
            <Link href={"/works"} className={linkStyle}>
                作品
            </Link>
            <Link href={"/about-me"} className={linkStyle}>
                私について
            </Link>
        </div>
    );
};
