import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import { Baking } from "@/routes/-components/baking";

const meta: Meta<typeof Baking> = {
    title: "routes/components/Baking",
    component: Baking,
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
                <Story />
            </Provider>
        ),
    ],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: {},
};
