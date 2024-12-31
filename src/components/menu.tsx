import { css } from "@/styled-system/css";
import { Menu as MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Drawer } from "./ui/drawer";

export const HamburgerMenu = () => {
    const data = [
        { url: "/blog", name: "書いたぶろぐ", label: "Blog" },
        { url: "/slides", name: "つくったスライド", label: "Slides" },
        { url: "/products", name: "作ったもの", label: "Products" },
        { url: "/about", name: "わたしについて", label: "About" },
    ];
    return (
        <div
            className={css({
                display: {
                    base: "block",
                    lg: "none",
                },
            })}
        >
            <Drawer.Root>
                <Drawer.Trigger asChild>
                    <MenuIcon
                        className={css({
                            width: "24px",
                            height: "24px",
                        })}
                    />
                </Drawer.Trigger>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.CloseTrigger
                            asChild
                            position="absolute"
                            top="32px"
                            right="32px"
                        >
                            <XIcon
                                className={css({
                                    width: "24px",
                                    height: "24px",
                                })}
                            />
                        </Drawer.CloseTrigger>

                        <Drawer.Body
                            className={css({
                                justifyContent: "center",
                                alignItems: "center",
                            })}
                        >
                            <ul
                                className={css({
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "32px",
                                })}
                            >
                                {data.map((item) => (
                                    <li
                                        className={css({
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            alignSelf: "stretch",
                                        })}
                                        key={item.url}
                                    >
                                        <Link href={item.url}>
                                            <div>
                                                <div
                                                    className={css({
                                                        alignSelf: "stretch",
                                                        color: "#000",
                                                        textAlign: "center",
                                                        fontSize: "16px",
                                                        fontStyle: "normal",
                                                        fontWeight: 500,
                                                        lineHeight:
                                                            "22px /* 137.5% */",
                                                    })}
                                                >
                                                    {item.name}
                                                </div>
                                                <div
                                                    className={css({
                                                        alignSelf: "stretch",
                                                        textAlign: "center",
                                                        fontSize: "10px",
                                                        fontStyle: "normal",
                                                        fontWeight: 300,
                                                        lineHeight:
                                                            "16px /* 100% */",
                                                        color: "var(--colors-accents-green-8, #5BB98B)",
                                                    })}
                                                >
                                                    {item.label}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </div>
    );
};

const linkStyle = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "16px",
    gap: "8px",
});
const linkContentStyle = css({
    color: "var(--colors-theme-fg-neutral-default, #202020)",
    textAlign: "center",
    fontFamily: "var(--font-m-plus-1p)",
    letterSpacing: "0.2em",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
});
