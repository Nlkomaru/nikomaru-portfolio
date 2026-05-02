import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "@/components/ui/provider";
import SlideCard from "@/routes/talks/-components/slide-card";
import { talksStorySlides } from "./talks-story-data";

const meta: Meta<typeof SlideCard> = {
    title: "routes/talks/SlideCard",
    component: SlideCard,
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
        slide: talksStorySlides[0],
        index: 0,
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutPresentationLink: Story = {
    args: {
        slide: talksStorySlides[2],
        index: 2,
    },
};
