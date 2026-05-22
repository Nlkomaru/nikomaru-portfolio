import type { Meta, StoryObj } from "@storybook/react";
import ProjectGallery from "@/routes/(site)/_main/projects/-components/project-gallery";
import { projectCardStoryItems } from "./project-story-data";

const meta: Meta<typeof ProjectGallery> = {
    title: "routes/(site)/_main/projects/ProjectGallery",
    component: ProjectGallery,
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
        projects: projectCardStoryItems,
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Mosaic: Story = {};

export const Compact: Story = {
    args: {
        projects: projectCardStoryItems.slice(0, 3),
    },
};
