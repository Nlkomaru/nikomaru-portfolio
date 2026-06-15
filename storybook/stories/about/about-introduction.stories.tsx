import type { Meta, StoryObj } from "@storybook/react";
import AboutIntroduction from "@/routes/(site)/_main/about/-components/about-introduction";

const meta: Meta<typeof AboutIntroduction> = {
    title: "routes/(site)/_main/about/AboutIntroduction",
    component: AboutIntroduction,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{ width: 1200, minWidth: 1200, padding: 24 }}>
                <Story />
            </div>
        ),
    ],
    args: {
        title: "I turn ideas into software that works in practice.",
        paragraphs: [
            "I'm Nikomaru, a computer science student and software developer.",
            "I work across web applications, APIs, and Minecraft server technology.",
        ],
        highlights: [
            "Minecraft plugins that support community gameplay",
            "Authentication and APIs connecting game and web",
            "Web interfaces designed for continued operation",
        ],
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
