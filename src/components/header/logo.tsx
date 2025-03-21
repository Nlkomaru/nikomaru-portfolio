import { css } from "@/styled-system/css";
import Link from "next/link";

export const Logo = () => {
    return (
        <Link href={"/"}>
            <div
                className={css({
                    display: "inline-block",
                    flex: "1 0 0",
                    fontFamily: "var(--font-montserrat-alternates)",
                    fontSize: {
                        base: "24px",
                        md: "28px",
                        lg: "32px",
                    },

                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "1.2",
                    _firstLetter: {
                        fontFamily: "var(--font-montserrat)",
                    },
                })}
            >
                Nikomaru
                <br />
                Portfolio
            </div>
        </Link>
    );
};
