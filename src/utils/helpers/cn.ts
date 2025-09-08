import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
	return twMerge(clsx(...inputs));
};

cn.stateful = <State = object>(
	...inputs: (ClassValue | ((s: State) => ClassValue))[]
) => {
	return (s: State) =>
		cn(inputs.map<ClassValue>((v) => (typeof v === "function" ? v(s) : v)));
};
