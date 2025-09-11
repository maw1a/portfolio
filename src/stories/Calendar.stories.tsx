import type { Meta, StoryObj } from "@storybook/nextjs";
import dayjs from "dayjs";
import { useState } from "react";
import { Calendar } from "./Calendar";

const meta = {
	title: "Components/Calendar",
	component: Calendar,
	render: ({ ...props }) => {
		const today = new Date();
		const [date, setDate] = useState(today);
		return (
			<Calendar
				{...props}
				required
				mode="single"
				captionLayout={"dropdown"}
				startMonth={dayjs(today).set("year", 1975).set("month", 0).toDate()}
				endMonth={dayjs(today).add(1, "year").set("month", 11).toDate()}
				selected={date}
				onSelect={setDate}
			/>
		);
	},
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
	args: {
		className: "rounded-md border shadow-sm",
	},
};
