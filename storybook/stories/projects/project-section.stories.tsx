import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import ProjectSection from "@/routes/(site)/_main/projects/-components/project-section";
import type { ProjectSection as ProjectSectionData } from "@/routes/(site)/_main/projects/-functions/parse-project-markdown";
import { imageSectionMarkdown, textOnlySectionMarkdown } from "./project-story-data";

const textOnlySection: ProjectSectionData = {
    text: textOnlySectionMarkdown,
};

const leftImageSection: ProjectSectionData = {
    text: imageSectionMarkdown,
    image: {
        src: "https://picsum.photos/seed/mineauth-scalar-section/960/540",
        alt: "MineAuth API documentation with Scalar",
        caption: "MineAuth API documentation with Scalar",
    },
    layout: "left-image",
};

const rightImageSection: ProjectSectionData = {
    ...leftImageSection,
    layout: "right-image",
};

const meta: Meta<typeof ProjectSection> = {
    title: "routes/(site)/_main/projects/ProjectSection",
    component: ProjectSection,
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
        section: textOnlySection,
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {};

export const LeftImage: Story = {
    args: {
        section: leftImageSection,
        imageNumber: 1,
    },
};

export const RightImage: Story = {
    args: {
        section: rightImageSection,
        imageNumber: 2,
    },
};
