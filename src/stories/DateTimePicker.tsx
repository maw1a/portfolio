"use client";

import dayjs from "dayjs";
import {
	type FC,
	Fragment,
	type InputHTMLAttributes,
	useId,
	useMemo,
	useState,
} from "react";
import {
	PiCalendarBlankBold,
	PiCheckBold,
	PiClockBold,
	PiPencilSimpleBold,
} from "react-icons/pi";
import { cn } from "@/utils/helpers/cn";
import { NumInput } from "./NumericInput";
import { Popover } from "./Popover";
import { Calendar } from "./Calendar";

export interface DateTimePickerProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
	value: Date;
	onChange?: (date: Date) => void;
}

const maxDate = dayjs(new Date())
	.add(1, "year")
	.set("month", 11)
	.set("date", 31);
const minDate = dayjs(new Date("1925-1-1"));

const isValidDate = (value: Date): true | Error => {
	if (Number.isNaN(value.getTime())) return new Error("invalid date");
	if (!(minDate.diff(value) <= 0))
		return new Error(`date must be after ${minDate.format("DD/MM/YYYY")}`);
	if (!(maxDate.diff(value) >= 0))
		return new Error(`date must be before ${maxDate.format("DD/MM/YYYY")}`);
	return true;
};

export const DateTimePicker: FC<DateTimePickerProps> = ({
	id: _id,
	value: _value,
	onChange,
	...props
}) => {
	const uid = useId();
	const [state, setState] = useState<{
		value: Date;
		pvalue: Date;
		editable: boolean;
		error: Error | null;
	}>({
		value: _value,
		pvalue: _value,
		editable: false,
		error: null,
	});
	const date = useMemo(
		() => dayjs(state.editable ? state.pvalue : state.value),
		[state.pvalue, state.value, state.editable],
	);
	const [dateId, timeId] = [`${_id || uid}__date`, `${_id || uid}__time`];

	return (
		<div
			className={cn(
				"flex justify-center items-stretch text-zinc-800 font-mono font-medium transition-all rounded-xl",
				state.editable
					? "gap-2 text-zinc-800"
					: "gap-0 text-zinc-600 shadow-md",
			)}
		>
			<div>
				<label
					htmlFor={dateId}
					className={cn(
						"flex items-center h-full pl-3 bg-zinc-100 rounded-l-xl transition-all border border-zinc-300 focus-within:ring-2",
						state.editable
							? "pr-3 rounded-r-xl shadow-md gap-1.5"
							: "pr-2 rounded-r-none border-r-0 gap-0.5",
						state.error ? "ring-red-600" : "ring-zinc-600",
					)}
					aria-disabled={!state.editable}
				>
					<div className="flex items-center gap-1">
						{date
							.format("DD/MM/YYYY")
							.split("/")
							.map((v, idx) => {
								const args = [
									{ key: "DD", unit: "date", min: 1, max: date.daysInMonth() },
									{ key: "MM", unit: "month", min: 1, max: 12 },
									{ key: "YYYY", unit: "year", min: 1925, max: maxDate.year() },
								][idx] as {
									key: "DD" | "MM" | "YYYY";
									unit: dayjs.UnitType;
									min: number;
									max: number;
								};
								return (
									<Fragment key={args.key}>
										{idx ? <span>/</span> : null}
										<NumInput
											value={v}
											min={args.min}
											max={args.max}
											minLength={idx === 2 ? 4 : 2}
											maxLength={idx === 2 ? 4 : 2}
											onBlur={(e) => {
												let value = Number(e.target.value);
												if (args.key === "MM") value -= 1;
												const newDate = date
													.clone()
													.set(args.unit, value)
													.toDate();
												setState((p) => ({
													...p,
													pvalue: newDate,
												}));
											}}
											disabled={!state.editable}
											className={cn(
												"outline-none py-2 spinner-none text-right",
												idx === 2 ? "w-[4ch]" : "w-[2ch]",
											)}
										/>
									</Fragment>
								);
							})}
					</div>
					<div
						className={cn(
							"transition-all overflow-hidden",
							state.editable ? "w-4" : "w-[1ch]",
						)}
					>
						{state.editable ? (
							<Popover>
								<Popover.Trigger className="flex items-center w-full h-full">
									<PiCalendarBlankBold className="size-4" />
								</Popover.Trigger>
								<Popover.Content
									side="bottom"
									sideOffset={18}
									className={"p-0 w-fit shadow-md rounded-xl border-zinc-300"}
								>
									<Calendar
										mode="single"
										required
										captionLayout="dropdown"
										className="rounded-xl bg-zinc-100"
										startMonth={minDate.toDate()}
										endMonth={maxDate.toDate()}
										selected={date.toDate()}
										onSelect={(d) =>
											setState((s) => ({
												...s,
												pvalue: date
													.clone()
													.set("year", d.getFullYear())
													.set("month", d.getMonth())
													.set("date", d.getDate())
													.toDate(),
											}))
										}
									/>
								</Popover.Content>
							</Popover>
						) : (
							","
						)}
					</div>
				</label>
				<input
					disabled={!state.editable}
					id={dateId}
					type="date"
					className="hidden"
					value={date.format("YYYY-MM-DD")}
				/>
			</div>
			<div>
				<label
					htmlFor={timeId}
					className={cn(
						"flex items-center h-full gap-1.5 bg-zinc-100 transition-all border border-zinc-300 focus-within:ring-2",
						state.editable
							? "px-3 rounded-xl shadow-md"
							: "pr-2 rounded-none border-x-0",
						state.error ? "ring-red-600" : "ring-zinc-600",
					)}
					aria-disabled={!state.editable}
				>
					<div className="flex items-center gap-1">
						{date
							.format("HH:mm")
							.split(":")
							.map((v, idx) => {
								const args = [
									{
										key: "HH",
										unit: "hour",
										min: 0,
										max: 23,
									},
									{
										key: "mm",
										unit: "minute",
										min: 0,
										max: 59,
									},
								][idx] as {
									key: "HH" | "mm";
									unit: dayjs.UnitType;
									min: number;
									max: number;
								};
								return (
									<Fragment key={args.key}>
										{idx ? <span>:</span> : null}
										<NumInput
											value={v}
											minLength={2}
											maxLength={2}
											min={args.min}
											max={args.max}
											onBlur={(e) => {
												const newDate = date
													.clone()
													.set(args.unit, Number(e.target.value))
													.toDate();
												setState((p) => ({
													...p,
													pvalue: newDate,
												}));
											}}
											disabled={!state.editable}
											className={cn(
												"outline-none py-2 spinner-none w-[2ch] text-right",
											)}
										/>
									</Fragment>
								);
							})}
					</div>
					<div
						className={cn(
							"transition-all overflow-hidden",
							state.editable ? "w-4 opacity-100" : "w-0 opacity-0",
						)}
					>
						<PiClockBold className="size-4" />
					</div>
				</label>
				<input
					disabled={!state.editable}
					id={timeId}
					type="time"
					className="hidden"
					value={date.format("HH:mm")}
				/>
			</div>
			<button
				type="button"
				className={cn(
					"p-2 pr-3 bg-zinc-100 rounded-r-xl transition-all border border-zinc-300 outline-none focus:ring-2",
					state.editable
						? "rounded-l-xl pl-3 shadow-md"
						: "rounded-l-none border-l-0",
					state.error ? "ring-red-600" : "ring-zinc-600",
				)}
				onClick={() => {
					if (state.editable) {
						const valid = isValidDate(state.pvalue);
						if (valid === true)
							setState((p) => ({
								...p,
								value: p.pvalue,
								editable: false,
								error: null,
							}));
						else setState((p) => ({ ...p, editable: true, error: valid }));
					} else setState((p) => ({ ...p, editable: true, error: null }));
				}}
			>
				{state.editable ? <PiCheckBold /> : <PiPencilSimpleBold />}
			</button>
		</div>
	);
};
