import { css } from "@/styled-system/css";
import { BookUser, Boxes, PenTool, Presentation } from "lucide-react";
import Link from "next/link";
import { Icon } from "~/components/ui/styled/icon";

export const Navbar = () => {
    return (
        <div
            className={css({
                display: {
                    base: "none",
                    lg: "block",
                },
            })}
        >
            <div
                className={css({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "8px",
                })}
            >
                <Link href={"/blog"} className={linkStyle}>
                    <Icon
                        className={css({
                            width: "24px",
                            height: "24px",
                        })}
                    >
                        <PenTool />
                    </Icon>
                    <div className={linkContentStyle}>書いたぶろぐ</div>
                </Link>
                <Link href={"/slides"} className={linkStyle}>
                    <Icon
                        className={css({
                            width: "24px",
                            height: "24px",
                        })}
                    >
                        <Presentation />
                    </Icon>
                    <div className={linkContentStyle}>つくったスライド</div>
                </Link>
                <Link href={"/products"} className={linkStyle}>
                    <Icon
                        className={css({
                            width: "24px",
                            height: "24px",
                        })}
                    >
                        <Boxes />
                    </Icon>
                    <div className={linkContentStyle}>作ったもの</div>
                </Link>
                <Link href={"/about"} className={linkStyle}>
                    <Icon
                        className={css({
                            width: "24px",
                            height: "24px",
                        })}
                    >
                        <BookUser />
                    </Icon>
                    <div className={linkContentStyle}>わたしについて</div>
                </Link>
            </div>
        </div>
    );
};

const linkStyle = css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "16px",
    gap: "16px",
});
const linkContentStyle = css({
    width: "35px",
    color: "var(--colors-theme-fg-neutral-default, #202020)",
    textAlign: "center",
    fontFamily: "var(--font-m-plus-1p)",
    writingMode: "vertical-rl",
    letterSpacing: "0.2em",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
});