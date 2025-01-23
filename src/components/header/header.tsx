import { css } from "@/styled-system/css";
import { HamburgerMenu } from "~/components/header/menu";
import { Navbar } from "~/components/header/navbar";
import { Logo } from "./logo";

export const Header = () => {
    return (
        <div
            className={css({
                display: "flex",
                margin: "0 auto", // 中央揃えに変更
                maxWidth: "1760px",
                alignContent: "center",
                padding: "32px",
                justifyContent: "space-between",
                alignItems: "flex-start",
            })}
        >
            <Logo />
            <div>
                <div
                    className={css({
                        display: {
                            base: "none",
                            lg: "block",
                        },
                    })}
                >
                    <Navbar />
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
