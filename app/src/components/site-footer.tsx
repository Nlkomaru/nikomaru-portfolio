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
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            w: "9",
            h: "9",
            borderRadius: "md",
            color: "fg.subtle",
            transition: "color 0.2s ease, background-color 0.2s ease",
            _hover: {
                bg: "bg.emphasized",
            },
        },
        socialIcon: {
            w: "4",
            h: "4",
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
        Icon: Github,
    },
    {
        href: "https://www.instagram.com/nikomaru0102/",
        label: "Instagram",
        Icon: Instagram,
    },
    {
        href: "https://x.com/nikomaru0102",
        label: "X",
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
                    {socialLinks.map(({ href, label, Icon }) => (
                        <a
                            key={href}
                            href={href}
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                        >
                            <Icon className={styles.socialIcon} aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
