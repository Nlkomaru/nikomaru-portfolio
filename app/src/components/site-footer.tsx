import { Github, Instagram, Twitter } from "lucide-react";
import { sva } from "styled-system/css";
import { m } from "../paraglide/messages";

const siteFooterStyles = sva({
    slots: ["root", "inner", "social", "socialLink", "socialIcon", "creditBlock", "creditOwner", "creditLicense"],
    base: {
        root: {
            w: "full",
            borderTopWidth: "1px",
            borderColor: "border.muted",
            bg: "bg.canvas",
        },
        inner: {
            maxW: "104rem",
            mx: "auto",
            display: "flex",
            flexDirection: { base: "column", md: "row" },
            alignItems: { base: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: "6",
            px: { base: "4", md: "12" },
            py: { base: "6", md: "8" },
        },
        social: {
            display: "flex",
            alignItems: "center",
            gap: "2",
        },
        socialLink: {
            "--social-color": "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            w: "12",
            h: "12",
            borderRadius: "md",
            color: "var(--social-color)",
            transition: "background-color 0.25s ease, transform 0.25s ease",
            "&[data-brand='github']": {
                "--social-color": "#8b5cf6",
            },
            "&[data-brand='instagram']": {
                "--social-color": "#dd00ae",
            },
            "&[data-brand='x']": {
                "--social-color": "#1d9bf0",
            },
            _hover: {
                bg: "color-mix(in srgb, var(--social-color) 12%, transparent)",
                transform: "translateY(-2px)",
                "& [data-social-icon]": {
                    transform: "scale(1.08)",
                },
            },
            _focusVisible: {
                outlineWidth: "2px",
                outlineStyle: "solid",
                outlineColor: "var(--social-color)",
                outlineOffset: "2px",
            },
        },
        socialIcon: {
            w: "4",
            h: "4",
            transition: "transform 0.25s ease",
            "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
            },
        },
        creditBlock: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "flex-start",
            maxW: { md: "xl" },
        },
        creditOwner: {
            color: "fg.subtle",
            fontSize: "sm",
            fontWeight: "500",
            lineHeight: "1.5",
        },
        creditLicense: {
            color: "fg.subtle",
            fontSize: "xs",
            lineHeight: "1.65",
        },
    },
});

const socialLinks = [
    {
        href: "https://github.com/nlkomaru",
        label: "GitHub",
        brand: "github",
        Icon: Github,
    },
    {
        href: "https://www.instagram.com/nikomaru0102/",
        label: "Instagram",
        brand: "instagram",
        Icon: Instagram,
    },
    {
        href: "https://x.com/nikomaru0102",
        label: "X",
        brand: "x",
        Icon: Twitter,
    },
] as const;

export function SiteFooter() {
    const styles = siteFooterStyles();

    return (
        <footer className={styles.root}>
            <div className={styles.inner}>
                <div className={styles.creditBlock}>
                    <p className={styles.creditOwner}>
                        <span>©</span>{" "}
                        <a
                            href="https://github.com/nlkomaru"
                            data-inline-link
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Nikomaru
                        </a>
                    </p>
                    <p className={styles.creditLicense}>
                        {m["siteFooter.licenseLead"]()}
                        <a
                            href="https://creativecommons.org/licenses/by/4.0/"
                            data-inline-link
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {m["siteFooter.licenseLinkLabel"]()}
                        </a>
                        {m["siteFooter.licenseTrail"]()}
                    </p>
                </div>
                <div className={styles.social}>
                    {socialLinks.map(({ href, label, brand, Icon }) => (
                        <a
                            key={href}
                            href={href}
                            className={styles.socialLink}
                            data-brand={brand}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                        >
                            <Icon className={styles.socialIcon} data-social-icon aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
