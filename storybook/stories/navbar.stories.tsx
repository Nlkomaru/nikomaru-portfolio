import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@/components/navbar";
import { DesktopNavbar } from "@/components/desktop-navbar";
import { MobileHeader } from "@/components/mobile-header";
import { Provider } from "@/components/ui/provider";

const meta: Meta<typeof Navbar> = {
    title: "components/Navbar",
    component: Navbar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <Provider>
                <div style={{ minHeight: 1280, width: 1200, minWidth: 1200 }}>
                    <Story />
                </div>
            </Provider>
        ),
    ],
};

export default meta;

export const Desktop: StoryObj<typeof meta> = {
    args: {},
    render: () => <DesktopNavbar />,
};

export const Mobile: StoryObj<typeof meta> = {
    args: {},
    render: () => <MobileHeader />,
    decorators: [
        (Story) => (
            <Provider>
                <div style={{ height: 800, width: 390, minWidth: 390 }}>
                    <Story />
                </div>
            </Provider>
        ),
    ],
};

