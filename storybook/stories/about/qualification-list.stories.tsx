import type { Meta, StoryObj } from "@storybook/react";
import QualificationList from "@/routes/(site)/_main/about/-components/qualification-list";

const meta: Meta<typeof QualificationList> = {
    title: "routes/(site)/_main/about/QualificationList",
    component: QualificationList,
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
        title: "Qualifications",
        description: "Certifications and licenses managed in JSON.",
        emptyLabel: "Qualification details are being prepared.",
        locale: "en",
        items: [
            {
                id: "sample",
                acquiredAt: "2025-04-15",
                name: "Sample Certification",
                issuer: "Sample Certification Organization",
            },
        ],
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
    args: {
        items: [],
    },
};
