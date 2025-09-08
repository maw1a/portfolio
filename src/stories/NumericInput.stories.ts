import type { Meta, StoryObj } from "@storybook/nextjs";
import { NumInput } from "./NumericInput";

const meta = {
	title: "Components/Numeric Input",
	component: NumInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodoc"],
	argTypes: {
		min: { control: "number", type: "number" },
		max: { control: "number", type: "number" },
		minLength: { control: "number", type: "number" },
		maxLength: { control: "number", type: "number" },
	},
} satisfies Meta<typeof NumInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
	args: {
		min: -5,
		max: 5,
		minLength: 2,
		maxLength: 2,
		placeholder: "00",
		className:
			"text-4xl font-mono w-[3ch] text-right outline-none font-medium border-b-4 border-zinc-400 focus:border-blue-600",
	},
};
