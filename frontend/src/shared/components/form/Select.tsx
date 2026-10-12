"use client"

import React, {useMemo} from "react";
import {cn, hasValue} from "@/shared";
import {Select as ShadCnSelect, SelectContent, SelectItem, SelectValue,} from "@/shared/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import {ChevronDownIcon} from "lucide-react";

const NOT_CHOSEN_VALUE = "¯\\_( ͡° ͜ʖ ͡°)_/¯";

export interface ISelectItem {
	value: string;
	label: string;
}

interface SelectFieldProps<T extends Record<string, any> = ISelectItem> {
	name: string;
	label: string;
	options: T[];
	value?: T | null; // Controlled value as string
	onChange: (value?: T | null) => void; // Change handler returns object T
	optionValueKey?: keyof T; // Key for value (default: "value")
	optionLabelKeys?: (keyof T | string | ((option: T) => string))[]; // ← string для "country.name" и функция
	optionLabelSeparator?: string; // default: ", "
	className?: string; // Styles for the SelectTrigger
	labelClassName?: string; // Styles for the Label
	wrapperClassName?: string; // Styles for the wrapper
	error?: string; // Optional error message
	showNotChosenText?: boolean; // show or hide 'not chosen' text
	notChosenText?: string; // Optional 'not chosen' text message
	disabled?: boolean;
}

const getByPath = (obj: any, path: string) =>
	path
	.split(".")
	.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);

export const Select = <T extends Record<string, any> = ISelectItem>({
	name,
	label,
	options,
	value,
	onChange,
	optionValueKey = "value" as keyof T,
	optionLabelKeys = ["label"],
	optionLabelSeparator = ", ",
	className,
	labelClassName,
	wrapperClassName,
	error,
	showNotChosenText = true,
	notChosenText = NOT_CHOSEN_VALUE,
	disabled = false,
}: SelectFieldProps<T>) => {
	const getOptionLabel = (option: T): string =>
		optionLabelKeys
		.map((k) => {
			if (typeof k === "function") return String(k(option));
			if (typeof k === "string" && k.includes("."))
				return String(getByPath(option, k) ?? "");
			return String(option[k as keyof T] ?? "");
		})
		.filter(Boolean)
		.join(optionLabelSeparator)
		.trim();

	// Handle value change from the underlying ShadCnSelect
	const handleValueChange = (newValue: string) => {
		// console.log({ newValue });
		if (newValue === NOT_CHOSEN_VALUE) {
			onChange(null);
			return;
		}
		const selectedOption = options.find(
			(option) => String(option[optionValueKey]) === newValue,
		);
		onChange(selectedOption);
	};
	const labeledOptions = useMemo(() => {
		return options.map((option) => ({
			option,
			label: getOptionLabel(option),
			value: String(option[optionValueKey]),
		}));
	}, [options, optionValueKey, optionLabelKeys]);

	const isEmptyValue = !hasValue(value);
	// console.log({ value, isEmptyValue });
	return (
		<div
			className={cn(
				"w-full relative",
				disabled ? "transition-none opacity-50" : "",
				wrapperClassName,
			)}
		>
			{/* Select Component */}
			<ShadCnSelect
				onValueChange={handleValueChange}
				value={
					isEmptyValue
						? NOT_CHOSEN_VALUE
						: String((value as T)?.[optionValueKey])
				}
			>
				<SelectTrigger
					id={name} // ← добавили
					className={cn(
						"peer bg-input dark:bg-input outline outline-gray-300 hover:bg-input hover:opacity-100 rounded-md px-3 py-2 w-full shadow-xs",
						"transition-colors duration-150 ease-in-out cursor-pointer",
						disabled
							? "cursor-not-allowed focus-visible:outline-none" // Apply disabled styles: opacity and no interaction
							: "focus-visible:outline-blue-600 hover:outline-blue-500",
						error &&
						"active:outline-red-500 focus-visible:outline-red-600 hover:outline-red-500", // Error handling
						className,
					)}
					disabled={disabled}
				>
					<SelectValue>
						{isEmptyValue ? "" : getOptionLabel(value as T)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{showNotChosenText && (
						<SelectItem key="default" value={NOT_CHOSEN_VALUE}>
							{notChosenText}
						</SelectItem>
					)}
					{labeledOptions.map((option) => {
						return (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						);
					})}
				</SelectContent>
			</ShadCnSelect>

			{/* Label */}
			<label
				htmlFor={name}
				className={cn(
					"flex items-center text-sm font-medium bg-input text-gray-300 absolute transition-all px-1 pointer-events-none",
					labelClassName,
					!isEmptyValue
						? "-top-4 left-2 h-4 text-xs rounded-t-md border-t border-x border border-gray-300 peer-hover:border-blue-500 peer-focus-visible:border-blue-600"
						: "top-[6px] left-2 text-base",
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

function SelectTrigger({
	className,
	size = "default",
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: "sm" | "default";
}) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			data-size={size}
			className={cn(
				"data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex w-fit items-center justify-between gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap disabled:cursor-not-allowed data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDownIcon className="size-4 opacity-50"/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}
