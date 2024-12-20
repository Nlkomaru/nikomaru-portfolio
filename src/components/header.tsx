import { css } from "@/styled-system/css";
import { Navbar } from "~/components/navbar";
import {HamburgerMenu} from "~/components/menu";

export const Header = () => {
    return (
        <div
            className={css({
                display: "flex",
                padding:{
                    base: "32px 32px",
                    lg: "var(--spacings-radii-64, 10vh) var(--spacings-radii-32, 15vw)",
                },
                justifyContent: "space-between",
                alignItems: "flex-start",
            })}
        >
            <div
                className={css({
                    display: "flex",
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
                            base: "var(--fontSizes-6xl, 32px)",
                            md: "var(--fontSizes-7xl, 48px)",
                            lg: "var(--fontSizes-8xl, 64px)",
                        },
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "normal",
                        _firstLetter: {
                            fontFamily: "var(--font-montserrat)",
                        },
                    })}
                >
                    Nikomaru
                    <br />
                    Portfolio
                </h1>
            </div>
            {/*Navbar lg:1024でハンバーガーに*/}
            <div>
                <Navbar />
                <HamburgerMenu />
            </div>
        </div>
    );
};
