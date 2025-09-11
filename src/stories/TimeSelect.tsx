"use client";

import type { FC } from "react";
import { cn } from "@/utils/helpers/cn";
import { CircularScrollableList } from "./CircularList";

type TimeSelectProps = React.ComponentProps<"input">;

const hours = Array.from({ length: 24 }, (_, v) => v);
const minutes = Array.from({ length: 60 }, (_, v) => v);

const renderItem = (
	item: number,
	state: { selected: boolean; offset: number },
	idx: number,
) => (
	<div
		data-circular-item="true"
		data-selected={state.selected}
		id={`item-${idx}`}
		className={cn(
			"transition-transform text-zinc-800 delay-200 ease-out",
			["scale-100", "scale-80", "scale-60"][Math.abs(state.offset)],
		)}
	>
		{item < 10 ? `0${item}` : item}
	</div>
);

export const TimeSelect: FC<TimeSelectProps> = ({ className, ...props }) => {
	return (
		<div className="h-fit font-mono text-4xl select-none">
			<div className="flex gap-4 h-full">
				<CircularScrollableList
					className="relative after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/80 after:via-white/0 after:to-white/80"
					items={hours}
					renderItem={renderItem}
					visibleCount={5}
				/>
				<div className="self-center flex flex-col gap-2 items-center before:size-1.5 before:bg-slate-800 before:rounded-full after:size-1.5 after:bg-slate-800 after:rounded-full" />
				<CircularScrollableList
					className="relative after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/80 after:via-white/0 after:to-white/80"
					items={minutes}
					renderItem={renderItem}
					visibleCount={5}
				/>
			</div>
			<input type="time" className="hidden" {...props} />
		</div>
	);
};
