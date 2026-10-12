"use client"

import React, {useState} from "react";
import {cn} from "@/shared/lib/utils";
import {Eye, EyeOff} from "lucide-react";

export interface LabeledPasswordInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	label: string;
	labelClassName?: string;
	wrapperClassName?: string;
	error?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LabeledPasswordInput: React.FC<
	LabeledPasswordInputProps
> = ({
	label,
	name,
	value,
	onChange,
	type = "password",
	className,
	labelClassName,
	wrapperClassName,
	error,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div
			className={cn(
				"w-full flex flex-col",
				props.disabled ? "transition-none opacity-50" : "",
				wrapperClassName
			)}
		>
			{label && <label
          htmlFor={name}
          className={cn(
						"flex items-center text-sm font-medium px-3 py-2 ",
						labelClassName
					)}
      >
				{label}
      </label>}
			<div className="relative">
				{" "}
				<input
					type={showPassword ? "text" : "password"}
					name={name}
					value={value}
					onChange={onChange}
					className={cn(
						"w-full h-10 outline outline-inactive text-base rounded-md px-3 py-2 shadow-xs", // Always apply border-gray-300
						"transition-colors duration-150 ease-in-out",
						props.disabled
							? "cursor-not-allowed focus-visible:outline-none" // Apply disabled styles: opacity and no interaction
							: "focus-visible:outline-border hover:outline-border",
						error &&
						"active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500", // Error handling
						className,
					)}
					{...props}
				/>

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
			</div>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
