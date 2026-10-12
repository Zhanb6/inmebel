"use client"
import React from "react";
import {cn} from "@/shared/lib/utils";
import {CalendarDays} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger,} from "@/shared/components/ui/popover";
import {format} from "date-fns";
import {CustomCalendar} from "@/shared/components";

export interface LabeledCalendarProps {
	label: string;
	error?: string;
	value?: Date;
	onChange?: (value: Date | undefined) => void;
	className?: string;
	labelClassName?: string;
	name?: string;
	disabled?: boolean; // Add the disabled prop
}

export const LabeledCalendar: React.FC<LabeledCalendarProps> = ({
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
				"w-full flex flex-col",
				disabled ? "transition-none opacity-50" : "",
			)}
		>
			{label && <label
          htmlFor={name}
          className={cn(
						"flex items-center text-sm font-medium px-3 py-2",
						labelClassName
					)}
      >
				{label}
      </label>}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						className={cn(
							"w-full flex items-center justify-between h-10 outline outline-inactive text-base rounded-md px-3 py-2 shadow-xs", // Always apply border-gray-300
							"transition-colors duration-150 ease-in-out",
							disabled
								? "cursor-not-allowed focus-visible:outline-none" // Apply disabled styles: opacity and no interaction
								: "focus-visible:outline-border hover:outline-border",
							error &&
							"active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500", // Error handling
							className,
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
						// className={"p-2"}
					/>
				</PopoverContent>
			</Popover>

			{/* Error Message */}
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
