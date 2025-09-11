"use client";

import { Popover as PopoverPrimitive } from "@base-ui-components/react/popover";
import type * as React from "react";
import { cn } from "@/utils/helpers/cn";

// Popover root
export const Popover = (
	props: React.ComponentProps<typeof PopoverPrimitive.Root>,
) => <PopoverPrimitive.Root {...props} />;

// PopoverTrigger with render prop (Base UI pattern)
interface PopoverTriggerProps
	extends React.ComponentProps<typeof PopoverPrimitive.Trigger> {}

Popover.Trigger = ({ render, className, ...props }: PopoverTriggerProps) => (
	<PopoverPrimitive.Trigger
		render={render}
		className={cn.stateful(
			"bg-transparent border-none cursor-pointer text-inherit font-inherit p-0",
			className,
		)}
		type="button"
		{...props}
	/>
);

interface PopoverContentProps
	extends React.ComponentProps<typeof PopoverPrimitive.Popup> {
	align?: "center" | "start" | "end";
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	alignOffset?: number;
	children: React.ReactNode;
}

Popover.Content = ({
	className = "",
	align = "center",
	side = "bottom",
	sideOffset = 4,
	alignOffset = 4,
	render,
	children,
	...props
}: PopoverContentProps) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Positioner
			align={align}
			side={side}
			sideOffset={sideOffset}
			alignOffset={alignOffset}
			className=""
		>
			<PopoverPrimitive.Popup
				{...props}
				render={render}
				className={cn.stateful(
					"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
					"data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
					"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					className,
				)}
			>
				{children}
			</PopoverPrimitive.Popup>
		</PopoverPrimitive.Positioner>
	</PopoverPrimitive.Portal>
);

interface PopoverBackdropProps
	extends React.ComponentProps<typeof PopoverPrimitive.Backdrop> {}

Popover.Backdrop = ({
	className = "",
	render,
	...props
}: PopoverBackdropProps) => (
	<PopoverPrimitive.Backdrop
		{...props}
		render={render}
		className={cn.stateful(
			"fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity data-[open]:opacity-100 data-[closed]:opacity-0",
			className,
		)}
	/>
);
