import type { Meta, StoryObj } from "@storybook/react";
import ProjectCard from "@/routes/(site)/_main/projects/-components/project-card";
import { projectCardStoryItems } from "./project-story-data";

const meta: Meta<typeof ProjectCard> = {
    title: "routes/(site)/_main/projects/ProjectCard",
    component: ProjectCard,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                    gap: 24,
                    width: 1200,
                    height: 800,
                    padding: 24,
                }}
            >
                <Story />
            </div>
        ),
    ],
    args: {
        project: projectCardStoryItems[0],
        placement: "largeStart",
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const LargeStart: Story = {};

export const Small: Story = {
    args: {
        project: projectCardStoryItems[1],
        placement: "small",
    },
};

export const LargeEnd: Story = {
    args: {
        project: projectCardStoryItems[3],
        placement: "largeEnd",
    },
};
