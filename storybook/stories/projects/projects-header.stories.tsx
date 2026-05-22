import type { Meta, StoryObj } from "@storybook/react";
import ProjectsHeader from "@/routes/(site)/_main/projects/-components/projects-header";

const meta: Meta<typeof ProjectsHeader> = {
    title: "routes/(site)/_main/projects/ProjectsHeader",
    component: ProjectsHeader,
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
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
