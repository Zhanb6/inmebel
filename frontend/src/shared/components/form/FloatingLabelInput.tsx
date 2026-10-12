import React from "react";
import {cn, hasValue} from "@/shared/lib/utils";

export interface FloatingLabelInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	label: string;
	labelClassName?: string;
	error?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
	label,
	name,
	value,
	onChange,
	type = "text",
	className,
	labelClassName,
	error,
	...props
}) => {
	const shouldFloatLabel = hasValue(value) || type === "date";

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// For onChange, just pass the raw value
		if (onChange) {
			onChange(e);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		let newVal = e.target.value.trim();
		if (type === "number" && newVal !== "") {
			// Use parseFloat to handle float numbers; this will remove leading zeros.
			newVal = String(parseFloat(newVal));
			// Create a synthetic event to update the value
			if (onChange) {
				// We create a new event object with the normalized value.
				onChange({
					...e,
					target: {...e.target, value: newVal},
				} as React.ChangeEvent<HTMLInputElement>);
			}
		}
	};

	return (
		<div
			className={cn(
				"w-full relative",
				props.disabled ? "transition-none opacity-50" : "",
			)}
		>
			<input
				type={type}
				name={name}
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				className={cn(
					"peer w-full h-10 outline outline-gray-300 text-base bg-input disabled:opacity-100 rounded-md px-3 py-2 shadow-xs", // Always apply border-gray-300
					"transition-colors duration-150 ease-in-out",
					props.disabled
						? "cursor-not-allowed focus-visible:outline-none" // Apply disabled styles: opacity and no interaction
						: "focus-visible:outline-blue-600 hover:outline-blue-500",
					error &&
					"active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500", // Error handling

					className,
				)}
				{...props}
			/>

			<label
				htmlFor={name}
				className={cn(
					"flex items-center text-sm font-medium bg-input text-gray-300 absolute transition-all px-1 pointer-events-none",
					labelClassName,
					shouldFloatLabel
						? "-top-4 left-2 h-4 text-xs rounded-t-md border-t border-x border border-gray-300 peer-hover:border-blue-500 peer-focus-visible:border-blue-600"
						: "top-2 left-2 text-base",
					props.disabled && "peer-hover:border-gray-300",
				)}
			>
				{label}
			</label>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
