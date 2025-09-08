import type { Meta, StoryObj } from "@storybook/nextjs";
import { DateTimePicker } from "./DateTimePicker";

const meta = {
	title: "Components/Date Time Picker",
	component: DateTimePicker,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		value: { control: "date" },
	},
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
	args: {
		value: new Date(),
	},
};
