import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import ProjectMarkdown from "@/routes/(site)/_main/projects/-components/project-markdown";
import { markdownStoryContent } from "./project-story-data";

const meta: Meta<typeof ProjectMarkdown> = {
    title: "routes/(site)/_main/projects/ProjectMarkdown",
    component: ProjectMarkdown,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <Provider>
                <div style={{ width: 960, minWidth: 960, padding: 24 }}>
                    <Story />
                </div>
            </Provider>
        ),
    ],
    args: {
        markdown: markdownStoryContent,
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const RichContent: Story = {};

export const ShortArticle: Story = {
    args: {
        markdown: `
## Overview

MineAuth lets Minecraft servers act as an identity provider for external tools.
`,
    },
};
