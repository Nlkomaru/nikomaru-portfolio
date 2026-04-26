import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import { ImageFrame } from "@/routes/-components/image-frame";

const meta: Meta<typeof ImageFrame> = {
    title: "routes/components/ImageFrame",
    component: ImageFrame,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "light",
        },
    },
    decorators: [
        (Story) => (
            <Provider>
                <div style={{ width: 420, height: 280 }}>
                    <Story />
                </div>
            </Provider>
        ),
    ],
    args: {
        src: "/sweets/napoleon-pastry.avif",
        alt: "Napoleon pastry",
        title: "Bonbon au chocolat",
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const LongTitle: Story = {
    args: {
        title: "Bonbon au chocolat (very very long title)",
    },
};
