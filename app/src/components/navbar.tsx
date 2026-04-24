import { sva } from "styled-system/css";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileHeader } from "./mobile-header";

const navbarStyles = sva({
    slots: ["desktop", "mobile"],
    base: {
        desktop: {
            display: { base: "none", md: "flex" },
        },
        mobile: {
            display: { base: "block", md: "none" },
        },
    },
});

export function Navbar() {
    const styles = navbarStyles();

    return (
        <>
            <div className={styles.desktop}>
                <DesktopNavbar />
            </div>
            <div className={styles.mobile}>
                <MobileHeader />
            </div>
        </>
    );
}

