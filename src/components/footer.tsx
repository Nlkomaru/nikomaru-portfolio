import { css } from "@/styled-system/css";
import Link from "next/link";
import { Icon } from "~/components/ui/icon";

export const Footer = () => {
    return (
        <div
            className={css({
                marginTop: "64px",
                //もう少し暗く
                backgroundColor: "var(--colors-bg-canvas)",
            })}
            id={"footer"}
        >
            <div
                className={css({
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "96px 32px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    borderTop: "2px solid var(--colors-border-default)",
                })}
            >
                <div
                    className={css({
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: {
                            base: "4px",
                            lg: "8px",
                        },
                        flexShrink: 0,
                    })}
                >
                    <div
                        className={css({
                            height: "30px",
                            flexShrink: 0,
                            alignSelf: "stretch",
                            color: "var(--colors-fg-default)",
                            fontSize: {
                                base: "20px",
                                lg: "24px",
                            },
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "30px /* 125% */",
                        })}
                    >
                        にこまる
                    </div>
                    <div
                        className={css({
                            color: "var(--colors-fg-subtle)",
                            textAlign: "center",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: "var(--typography-weight-regular, 400)",
                            lineHeight: "30px /* 214.286% */",
                        })}
                    >
                        nikomaru
                    </div>
                </div>
                <div
                    className={css({
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "24px",
                        flexShrink: 0,
                    })}
                >
                    <Link
                        href={"http://github.com/nlkomaru"}
                        className={BrandWithIconStyle}
                    >
                        <Icon className={IconStyle}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-github"
                            >
                                <title>Github</title>
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </Icon>
                        <div className={BrandStyle}>Github</div>
                    </Link>
                    <Link
                        href={"http://x.com/nikoamru0102"}
                        className={BrandWithIconStyle}
                    >
                        <Icon className={IconStyle}>
                            <svg
                                width="1200"
                                height="1227"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 1200 1227"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>X</title>
                                <path
                                    d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                                    fill="var(--colors-fg-default)"
                                />
                            </svg>
                        </Icon>
                        <div className={BrandStyle}>X</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
const BrandWithIconStyle = css({
    display: "flex",
    alignItems: "center",
    gap: {
        base: "8px",
        lg: "16px",
    },
    alignSelf: "stretch",
});

const IconStyle = css({
    width: {
        base: "16px",
        lg: "24px",
    },
    height: {
        base: "16px",
        lg: "24px",
    },
    color: "var(--colors-fg-default)",
});

const BrandStyle = css({
    color: "var(--colors-fg-default)",
    textAlign: "center",
    fontSize: "22px",
    fontStyle: "normal",
    fontWeight: 400,
    paddingLeft: "8px",
    lineHeight: "30px /* 150% */",
    //hidden
    display: {
        base: "none",
        lg: "block",
    },
    width: {
        base: "0px",
        lg: "auto",
    },
});
