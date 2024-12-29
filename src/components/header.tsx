import { css } from "@/styled-system/css";
import { HamburgerMenu } from "~/components/menu";
import { Navbar } from "~/components/navbar";
import { Title } from "./title";

export const Header = () => {
    return (
        <div
            className={css({
                display: "flex",
                padding: {
                    base: "32px 32px",
                    lg: "var(--spacings-radii-64, 10vh) 32px",
                },
                margin: "0 auto",
                maxWidth: "1400px",
                width: "100%",
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
                <Title />
            </div>
            <div>
                <Navbar />
                <HamburgerMenu />
            </div>
        </div>
    );
};
