import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import TalksYearGroup from "@/routes/talks/-components/talks-year-group";
import { talksStorySlides } from "./talks-story-data";

const meta: Meta<typeof TalksYearGroup> = {
    title: "routes/talks/TalksYearGroup",
    component: TalksYearGroup,
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
        year: 2024,
        slides: talksStorySlides.slice(0, 2),
        countLabel: "02 Entries",
        groupClassName: "talks-story-year-group",
        headerClassName: "talks-story-year-header",
        yearLabelClassName: "talks-story-year-label",
        countClassName: "talks-story-year-count",
        bodyClassName: "talks-story-year-body",
    },
    render: (args) => (
        <>
            <style>{`
                .talks-story-year-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    width: 100%;
                }
                .talks-story-year-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                }
                .talks-story-year-label {
                    color: var(--chakra-colors-fg-default);
                    font-family: var(--chakra-fonts-heading);
                    font-size: 3rem;
                    font-weight: 600;
                    letter-spacing: -0.035em;
                    line-height: 1;
                }
                .talks-story-year-count {
                    color: var(--chakra-colors-fg-subtle);
                    font-family: var(--chakra-fonts-mono);
                    font-size: 0.75rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .talks-story-year-body {
                    display: flex;
                    flex-direction: column;
                    padding: 0.75rem;
                    border-bottom: 1px solid var(--chakra-colors-border-muted);
                }
            `}</style>
            <TalksYearGroup {...args} />
        </>
    ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeItems: Story = {
    args: {
        year: 2025,
        slides: talksStorySlides,
        countLabel: "03 Entries",
    },
};
