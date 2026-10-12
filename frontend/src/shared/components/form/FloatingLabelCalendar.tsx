"use client"

import React from "react";
import {cn, hasValue} from "@/shared/lib/utils";
import {CalendarDays} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger,} from "@/shared/components/ui/popover";
import {format} from "date-fns";
import {CustomCalendar} from "@/shared/components";

export interface FloatingLabelCalendarProps {
	label: string;
	error?: string;
	value?: Date;
	onChange?: (value: Date | undefined) => void;
	className?: string;
	labelClassName?: string;
	name?: string;
	disabled?: boolean; // Add the disabled prop
}

export const FloatingLabelCalendar: React.FC<FloatingLabelCalendarProps> = ({
	label,
	value,
	onChange,
	className,
	labelClassName,
	error,
	name,
	disabled = false, // Default disabled value is false
}) => {
	const [open, setOpen] = React.useState(false);

	return (
		<div
			className={cn(
				"w-full relative",
				disabled ? "transition-none opacity-50" : "",
			)}
		>
			{" "}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						className={cn(
							"peer w-full h-10 flex items-center justify-between outline outline-gray-300 text-base bg-input disabled:opacity-100 rounded-md px-3 py-2 shadow-xs", // Always apply border-gray-300
							"transition-colors duration-150 ease-in-out cursor-pointer",
							disabled
								? "cursor-not-allowed focus-visible:outline-none" // Apply disabled styles: opacity and no interaction
								: "focus-visible:outline-blue-600 hover:outline-blue-500 ",
							className,
							error &&
							"active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500", // Error handling
						)}
						disabled={disabled} // Disable the button
					>
						<span>{value ? format(value, "dd-MM-yyyy") : ""}</span>
						<CalendarDays className="w-5 h-5 text-accent flex-shrink-0"/>
					</button>
				</PopoverTrigger>
				<PopoverContent align="start" className="p-0 w-full p-4 rounded-xl">
					<CustomCalendar
						mode="single"
						captionLayout="dropdown"
						selected={value}
						onSelect={(date) => {
							if (!disabled) {
								onChange?.(date);
								setOpen(false);
							}
						}}
						disabled={disabled} // Disable the calendar
					/>
				</PopoverContent>
			</Popover>
			{/* Label placed below */}
			<label
				htmlFor={name}
				className={cn(
					"flex items-center text-sm font-medium bg-input text-gray-300 absolute transition-all px-1 pointer-events-none",
					labelClassName,
					hasValue(value)
						? "-top-4 left-2 h-4 text-xs rounded-t-md border-t border-x border border-gray-300 peer-hover:border-blue-500 peer-focus-visible:border-blue-600"
						: "top-2 left-2 text-base",
					disabled && "peer-hover:border-gray-300",
				)}
			>
				{label}
			</label>
			{/* Error Message */}
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
