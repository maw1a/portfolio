import type { Meta, StoryObj } from "@storybook/nextjs";
import { TimeSelect } from "./TimeSelect";

const meta = {
	title: "Components/Time Select",
	component: TimeSelect,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof TimeSelect>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {
	args: {},
};
