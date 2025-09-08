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

Popover.Trigger = ({ render, ...props }: PopoverTriggerProps) => {
	return (
		<PopoverPrimitive.Trigger
			render={render}
			className="bg-transparent border-none cursor-pointer text-inherit font-inherit p-0"
			type="button"
			{...props}
		/>
	);
};

// PopoverContent with Tailwind animation classes
interface PopoverContentProps
	extends React.ComponentProps<typeof PopoverPrimitive.Popup> {
	align?: "center" | "start" | "end";
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	children: React.ReactNode;
}

Popover.Content = ({
	className = "",
	align = "center",
	side = "bottom",
	sideOffset = 4,
	render,
	children,
	...props
}: PopoverContentProps) => {
	// Animation classes from shadcn/ui popover
	const base =
		"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none";
	const animation =
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";
	const sideAnimation =
		"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				className=""
			>
				<PopoverPrimitive.Popup
					{...props}
					render={render}
					className={cn.stateful(base, animation, sideAnimation, className)}
				>
					{children}
				</PopoverPrimitive.Popup>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
};

// PopoverBackdrop with Tailwind classes
interface PopoverBackdropProps
	extends React.ComponentProps<typeof PopoverPrimitive.Backdrop> {}

Popover.Backdrop = ({
	className = "",
	render,
	...props
}: PopoverBackdropProps) => {
	// shadcn/ui modal overlay style
	return (
		<PopoverPrimitive.Backdrop
			{...props}
			render={render}
			className={cn.stateful(
				"fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity data-[open]:opacity-100 data-[closed]:opacity-0",
				className,
			)}
		/>
	);
};
