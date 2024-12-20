import { css } from "@/styled-system/css";
import { Menu as MenuIcon, PenTool } from "lucide-react";
import Link from "next/link";
import { Icon } from "~/components/ui/styled/icon";
import { Menu } from "./ui/menu";

export const HamburgerMenu = () => {
    return (
        <div
            className={css({
                display: {
                    base: "block",
                    lg: "none",
                },
            })}
        >
            <Menu.Root>
                <Menu.Trigger asChild>
                    <MenuIcon />
                </Menu.Trigger>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            <Menu.Item value="blog">
                                <Link href={"/blog"} className={linkStyle}>
                                    <Icon
                                        className={css({
                                            width: "24px",
                                            height: "24px",
                                        })}
                                    >
                                        <PenTool />
                                    </Icon>
                                    <div className={linkContentStyle}>
                                        書いたぶろぐ
                                    </div>
                                </Link>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Menu.Root>
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
