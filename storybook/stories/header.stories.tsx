import type { Meta, StoryObj } from "@storybook/react";
import Header from "@/components/header";

const meta: Meta<typeof Header> = {
    title: "components/Header",
    component: Header,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
};

export const Default: StoryObj<typeof meta> = {
    args: {},
};

export default meta;
