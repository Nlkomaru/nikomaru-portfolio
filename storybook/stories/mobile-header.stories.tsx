import type { Meta, StoryObj } from "@storybook/react";
import { MobileHeader } from "@/components/mobile-header";
import { Provider } from "@/components/ui/provider";

const meta: Meta<typeof MobileHeader> = {
    title: "components/MobileHeader",
    component: MobileHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
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

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: {},
};
