import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./Button";

const meta = {
	title: "Components/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: { control: "multi-select", options: ["default", "sm", "lg", "icon"] },
		variant: {
			control: "multi-select",
			options: [
				"default",
				"destructive",
				"outline",
				"secondary",
				"ghost",
				"link",
			],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
	args: {
		size: "default",
		variant: "default",
		children: "Button",
	},
};

export const Render: Story = {
	args: {
		size: "default",
		variant: "default",
		children: "Button",
	},
	render: (args) => <Button {...args} render={<div />} />,
};
