import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import { ImageFrame } from "@/routes/-components/image-frame";

const meta: Meta<typeof ImageFrame> = {
    title: "routes/root/ImageFrame",
    component: ImageFrame,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <Provider>
                <div style={{ width: 460, height: 360 }}>
                    <Story />
                </div>
            </Provider>
        ),
    ],
    args: {
        src: "/sweets/bonbon-au-chocolat.avif",
        alt: "Bonbon au chocolat",
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
