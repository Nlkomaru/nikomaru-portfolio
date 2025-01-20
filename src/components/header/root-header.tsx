import { css } from "@/styled-system/css";
import { HamburgerMenu } from "~/components/header/menu";
import { RootNavbar } from "~/components/header/root-navbar";
import { RootLogo } from "./root-logo";

export const RootHeader = () => {
    return (
        <div
            className={css({
                display: "flex",
                padding: {
                    base: "32px 32px",
                    lg: "var(--spacings-radii-64, 10vh) 32px",
                },
                margin: "0 auto",
                height: "100vh",
                maxWidth: "1600px",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "flex-start",
            })}
        >
            <div
                className={css({
                    display: "flex",
                    padding: "var(--spacings-radii-56, 25vh) 0px",
                    margin: "auto 0",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                })}
            >
                <RootLogo />
            </div>
            <div>
                <div
                    className={css({
                        display: {
                            base: "none",
                            lg: "block",
                        },
                    })}
                >
                    <RootNavbar />
                </div>
                <div
                    className={css({
                        display: {
                            base: "block",
                            lg: "none",
                        },
                    })}
                >
                    <HamburgerMenu />
                </div>
            </div>
        </div>
    );
};
