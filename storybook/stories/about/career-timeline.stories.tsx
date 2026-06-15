import type { Meta, StoryObj } from "@storybook/react";
import CareerTimeline from "@/routes/(site)/_main/about/-components/career-timeline";

const meta: Meta<typeof CareerTimeline> = {
    title: "routes/(site)/_main/about/CareerTimeline",
    component: CareerTimeline,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{ width: 1044, minWidth: 1044, padding: 24 }}>
                <Story />
            </div>
        ),
    ],
    args: {
        title: "Timeline",
        description: "Education and community work shown by period.",
        presentLabel: "Present",
        locale: "en",
        items: [
            {
                id: "university",
                startDate: "2023-04",
                endDate: null,
                title: "Shinshu University, Bachelor of Engineering",
                description: "Studying computer science in the Faculty of Engineering.",
            },
            {
                id: "community",
                startDate: "2023-04",
                endDate: null,
                title: "Morino Party, Software Developer",
                description: "Developing web applications and Minecraft server technology.",
            },
        ],
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
