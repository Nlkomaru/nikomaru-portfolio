import { css } from "@/styled-system/css";
import { Icon } from "~/components/ui/icon";

export const Footer = () => {
    return (
        <div
            className={css({
                padding: {
                    base: "24px 64px",
                    md: "48px 128px",
                    lg: "96px 256px",
                },
                marginTop: "auto",
                backgroundColor: "var(--colors-theme-bg-neutral, #f6f8fa)",
            })}
        >
            <div
                className={css({
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                })}
            >
                <div
                    className={css({
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "16px",
                        flexShrink: 0,
                    })}
                >
                    <div
                        className={css({
                            height: "30px",
                            flexShrink: 0,
                            alignSelf: "stretch",
                            color: "var(--colors-theme-fg-neutral-default, #202020)",
                            fontSize: "32px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "30px /* 125% */",
                        })}
                    >
                        にこまる
                    </div>
                    <div
                        className={css({
                            color: "var(--colors-theme-fg-neutral-subtle, #838383)",
                            textAlign: "center",
                            fontSize: "16px",
                            paddingLeft: "3px",
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
                        width: "98px",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "24px",
                        flexShrink: 0,
                    })}
                >
                    <div className={BrandWithIconStyle}>
                        <Icon className={IconStyle}>
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>GitHub</title>
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                        </Icon>
                        <div className={BrandStyle}>Github</div>
                    </div>
                    <div className={BrandWithIconStyle}>
                        <Icon className={IconStyle}>
                            <svg
                                width="1200"
                                height="1227"
                                viewBox="0 0 1200 1227"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>X</title>
                                <path
                                    d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                                    fill="black"
                                />
                            </svg>
                        </Icon>
                        <div className={BrandStyle}>X</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const BrandWithIconStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "16px",
    alignSelf: "stretch",
});

const IconStyle = css({
    width: "32px",
    height: "32px",
    color: "var(--colors-theme-fg-neutral-default, #202020)",
});

const BrandStyle = css({
    color: "var(--colors-theme-fg-neutral-default, #202020)",
    textAlign: "center",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "30px /* 150% */",
    //hidden
    display: {
        base: "none",
        lg: "block",
    },
});
