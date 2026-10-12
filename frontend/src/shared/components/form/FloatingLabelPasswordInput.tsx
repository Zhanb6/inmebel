"use client"

import React, {useState} from "react";
import {cn} from "@/shared/lib/utils";
import {Eye, EyeOff} from "lucide-react";

export interface FloatingLabelPasswordInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	label: string;
	labelClassName?: string;
	error?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FloatingLabelPasswordInput: React.FC<
	FloatingLabelPasswordInputProps
> = ({
	label,
	name,
	value,
	onChange,
	type = "password",
	className,
	labelClassName,
	error,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div
			className={cn(
				"w-full relative",
				props.disabled ? "transition-none opacity-50" : "",
			)}
		>
			{" "}
			<input
				type={showPassword ? "text" : "password"}
				name={name}
				value={value}
				onChange={onChange}
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
					String(value).length > 0
						? "-top-4 left-2 h-4 text-xs rounded-t-md border-t border-x border border-gray-300 peer-hover:border-blue-500 peer-focus-visible:border-blue-600"
						: "top-2 left-2 text-base",
					props.disabled && "peer-hover:border-gray-300",
				)}
			>
				{label}
			</label>
			<button
				type="button"
				onClick={() => setShowPassword(!showPassword)}
				className="absolute right-3 top-3 text-muted-foreground"
				aria-label="Toggle password visibility"
			>
				{showPassword ? (
					<EyeOff className="h-5 w-5"/>
				) : (
					<Eye className="h-5 w-5"/>
				)}
			</button>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
