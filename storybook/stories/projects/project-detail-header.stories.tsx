import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import ProjectDetailHeader from "@/routes/(site)/_main/projects/$project/-components/project-detail-header";
import { mineAuthStoryProject } from "./project-story-data";

const meta: Meta<typeof ProjectDetailHeader> = {
    title: "routes/(site)/_main/projects/ProjectDetailHeader",
    component: ProjectDetailHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <Provider>
                <div style={{ width: 1200, minWidth: 1200, padding: 24 }}>
                    <Story />
                </div>
            </Provider>
        ),
    ],
    args: {
        project: mineAuthStoryProject,
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongAbstract: Story = {
    args: {
        project: {
            ...mineAuthStoryProject,
            abstract:
                "MineAuth provides reusable authentication, authorization, and API documentation primitives for Minecraft servers that need to expose player-aware web experiences without moving identity management out of the plugin ecosystem.",
        },
    },
};
