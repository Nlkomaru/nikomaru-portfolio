import { css } from "@/styled-system/css";
import {BookUser, Boxes, PenTool, Presentation} from "lucide-react";
import Link from "next/link";
import { Icon } from "~/components/ui/icon";

export const Header = () => {
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
    return (
        <div
            className={css({
                display: "flex",
                padding:
                    "var(--spacings-radii-64, 10vh) var(--spacings-radii-32, 15vw)",
                justifyContent: "space-between",
                alignItems: "flex-start",
            })}
        >
            <div
                className={css({
                    display: "flex",
                    width: "493px",
                    padding: "var(--spacings-radii-56, 25vh) 0px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                })}
            >
                <h1
                    className={css({
                        flex: "1 0 0",
                        color: "var(--colors-theme-fg-neutral-default, #202020)",
                        fontFamily: "var(--font-montserrat-alternates)",
                        fontSize: {
                            base: "var(--fontSizes-6xl, 48px)",
                            md: "var(--fontSizes-7xl, 64px)",
                            lg: "var(--fontSizes-8xl, 80px)",
                        },
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "normal",
                    })}
                >
                    Nikomaru
                    <br />
                    Portfolio
                </h1>
            </div>
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
                    {/*--font-m-plus-1p*/}
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
                    {/*--font-m-plus-1p*/}
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
                    {/*--font-m-plus-1p*/}
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
                    {/*--font-m-plus-1p*/}
                    <div className={linkContentStyle}>わたしについて</div>
                </Link>
            </div>
        </div>
    );
};
