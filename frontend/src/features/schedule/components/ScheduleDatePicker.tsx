"use client";
import "react-day-picker/style.css";
import React from "react";
import {CustomCalendar} from "@/shared/components";

export interface IScheduleDatePickerProps {
	selected?: Date | undefined;
	onSelect?: (selectedDate: Date | undefined) => void;
}

export function ScheduleDatePicker(props: IScheduleDatePickerProps) {
	return (
		<CustomCalendar
			{...props}
			startMonth={new Date(2025, 0)}
			endMonth={new Date(2040, 11)}
			mode="single"
		/>
	);
}

