import {
	Fragment,
	type PointerEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
	type WheelEvent,
} from "react";
import { cn } from "@/utils/helpers/cn";

type CircularScrollableListProps<T> = {
	items: T[];
	renderItem: (
		item: T,
		state: { selected: boolean; offset: number },
		index: number,
	) => ReactNode;
	visibleCount: number;
	className?: string;
};

export function CircularScrollableList<T>({
	items,
	renderItem,
	visibleCount,
	className,
}: CircularScrollableListProps<T>) {
	const [offset, setOffset] = useState(0); // fractional index offset
	const velocityRef = useRef(0);
	const animationRef = useRef<number | null>(null);
	const dragRef = useRef<{
		startY: number;
		lastY: number;
		dragging: boolean;
	} | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Helper: get item at circular index
	const getItem = (i: number) =>
		items[((i % items.length) + items.length) % items.length];

	// Calculate item height dynamically
	const [itemHeight, setItemHeight] = useState(0);

	useEffect(() => {
		if (containerRef.current) {
			const firstItem = containerRef.current.querySelector(
				'[data-circular-item="true"]',
			) as HTMLElement;
			if (firstItem) {
				setItemHeight(firstItem.offsetHeight);
			}
		}
	}, []);

	// Start drag
	const onPointerDown = (e: PointerEvent) => {
		dragRef.current = {
			startY: e.clientY,
			lastY: e.clientY,
			dragging: true,
		};
		if (animationRef.current) cancelAnimationFrame(animationRef.current);
		velocityRef.current = 0;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	};

	// Drag move
	const onPointerMove = (e: PointerEvent) => {
		if (!dragRef.current?.dragging || itemHeight === 0) return;
		const dy = e.clientY - dragRef.current.lastY;
		setOffset((prev) => prev - dy / itemHeight);
		velocityRef.current = -dy / itemHeight;
		dragRef.current.lastY = e.clientY;
	};

	// End drag, start inertia
	const onPointerUp = () => {
		if (!dragRef.current?.dragging) return;
		dragRef.current.dragging = false;
		inertiaScroll();
	};

	// Mouse wheel scroll
	const onWheel = (e: WheelEvent) => {
		if (itemHeight === 0) return;
		e.preventDefault();
		const delta = e.deltaY / itemHeight;
		setOffset((prev) => prev + delta);
		velocityRef.current = delta;
		if (animationRef.current) cancelAnimationFrame(animationRef.current);
		inertiaScroll();
	};

	// Inertia animation
	const inertiaScroll = () => {
		let v = velocityRef.current;
		const friction = 0.92;
		const minVelocity = 0.01;

		const animate = () => {
			if (Math.abs(v) > minVelocity) {
				setOffset((prev) => prev + v);
				v *= friction;
				animationRef.current = requestAnimationFrame(animate);
			} else {
				setOffset((prev) => Math.round(prev));
				animationRef.current = null;
			}
		};
		animate();
	};

	// Clean up animation frame
	useEffect(() => {
		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, []);

	// Render visible items
	const center = Math.round(offset);
	const itemsToShow = [];
	for (
		let i = -Math.floor(visibleCount / 2);
		i <= Math.floor(visibleCount / 2);
		i++
	) {
		const idx = center + i;
		const isCenter = i === 0;
		itemsToShow.push(
			<Fragment key={i}>
				{renderItem(
					getItem(idx),
					{ selected: isCenter, offset: i },
					((idx % items.length) + items.length) % items.length,
				)}
			</Fragment>,
		);
	}

	return (
		<div
			ref={containerRef}
			className={cn(
				"flex flex-col overflow-hidden select-none cursor-grab",
				className,
			)}
			style={{ touchAction: "pan-y" }}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerLeave={onPointerUp}
			onWheel={onWheel}
			tabIndex={0}
			role="listbox"
			aria-activedescendant={`item-${center}`}
		>
			{itemsToShow}
		</div>
	);
}
