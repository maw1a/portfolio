import type { Meta, StoryObj } from "@storybook/nextjs";
import type * as React from "react";
import { Popover } from "./Popover";

type ComponentProps = React.ComponentProps<typeof Popover> & {
	trigger: React.ComponentProps<typeof Popover.Trigger>;
	content: React.ComponentProps<typeof Popover.Content>;
};

const meta = {
	title: "Components/Popover",
	component: Popover,
	render: ({ trigger, content, ...root }) => (
		<Popover {...root}>
			<Popover.Trigger {...trigger} />
			<Popover.Content {...content} />
		</Popover>
	),
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		trigger: { children: "text" },
		content: { children: "text" },
	},
} satisfies Meta<ComponentProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
	args: {
		trigger: { children: "Trigger Popover" },
		content: { children: "Popover Content" },
	},
};
