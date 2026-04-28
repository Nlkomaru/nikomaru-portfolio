import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { overwriteGetLocale } from "@/paraglide/runtime";
import { IntroP3 } from "@/routes/-components/intro-p3";
import { withDummyRouter } from "../../.storybook/dummy-router";

// Decorator that overrides the paraglide locale for each story
const withLocale =
    (locale: "ja" | "en"): Decorator =>
    (Story) => {
        overwriteGetLocale(() => locale);
        return <Story />;
    };

const meta: Meta<typeof IntroP3> = {
    title: "routes/root/IntroP3",
    component: IntroP3,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    decorators: [withDummyRouter("/")],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Japanese: Story = {
    decorators: [withLocale("ja")],
};

export const English: Story = {
    decorators: [withLocale("en")],
};
