"use client";
import {DayPicker, DayPickerProps, DropdownProps, type Locale} from "react-day-picker";
import "react-day-picker/style.css";
import React, {ReactNode, useState} from "react";
import {enUS, kk, ru} from "react-day-picker/locale";
import {useTranslation} from "@/i18n";
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {cn} from "@/shared";
import {format, isSameDay} from "date-fns";

const localesMap: Record<string, Locale> = {kk, ru, en: enUS};
const chevronsMap: Record<string, ReactNode> = {
	up: <ArrowUp className="w-4.5"/>,
	down: <ArrowDown className="w-4.5"/>,
	left: <ArrowLeft className="w-4.5"/>,
	right: <ArrowRight className="w-4.5"/>
};
const chevronsClassesMap: Record<string, string> = {
	up: "",
	down: "",
	left: "justify-start",
	right: "justify-end"
};
const capitalizeFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export interface ICustomCalendarProps {
	selected?: Date | undefined;
	onSelect?: (selectedDate: Date | undefined) => void;
}

export function CustomCalendar(props: DayPickerProps & ICustomCalendarProps) {
	const {i18n} = useTranslation();
	const currentLocale = localesMap[i18n.language];
	const [selected, setSelected] = useState<Date | undefined>(props?.selected);

	return (
		<DayPicker
			{...props}
			animate
			locale={currentLocale}
			mode="single"
			selected={selected}
			onSelect={(value) => {
				props.onSelect?.(value);
				setSelected(value)
			}}
			captionLayout="dropdown"
			navLayout="after"
			className="w-full"
			formatters={{
				formatCaption: (month, options) =>
					capitalizeFirst(format(month, "LLLL yyyy", options)),
				formatWeekdayName: (weekday, options) =>
					format(weekday, "EEEEEE", options).toUpperCase(), // «ПН», «ВТ», …
			}}
			modifiers={{
				picked: (date) => !!selected && isSameDay(date, selected),
			}}
			components={{
				Root: (props) => {
					const {className, children, rootRef, ...rest} = props;
					return (
						<div ref={rootRef} {...rest} className={cn(className, "relative w-full")}>
							<div
								aria-hidden
								className="pointer-events-none absolute inset-x-0 bottom-0 top-12 rounded-xl bg-card z-0"
							/>
							<div className="relative z-10 flex">{children}</div>
						</div>
					);
				},
				Dropdown: CustomCalendarSelectDropdown,
				PreviousMonthButton: (props) => (
					<button {...props} className="w-6">
					</button>
				),
				NextMonthButton: (props) => (
					<button {...props} className="w-6">
					</button>
				),
				Chevron: (props) => (
					<span
						className={cn("transition-colors size-full flex items-center",
							props.orientation && chevronsClassesMap[props.orientation]
						)}
						style={{color: "var(--icon-muted)"}}
					>
            {props.orientation && chevronsMap[props.orientation]}
          </span>
				),

				MonthGrid: (props) => (
					<div {...props} className="p-2">
						<table {...props}>
						</table>
					</div>
				),
				Weekday: (props) => (
					<th {...props} className={cn(props.className, "capitalize")}/>
				),
				Day: (props) => (
					<td {...props} className={cn(props.className, "items-center justify-items-center")}/>
				),
				DayButton: (props) => {
					const {modifiers} = props;
					const isPicked = !!modifiers.picked;
					const isToday = !!modifiers.today;

					return (
						<button
							{...props}
							className={cn(
								props.className,
								"w-full aspect-square p-0 leading-none rounded-full",
								isPicked && "!bg-accent !text-secondary !border-accent",
								isToday && "!border-accent"
							)}
						/>
					);
				},
			}}
			styles={{
				root: {width: '100%',},
				month_grid: {width: '100%'},
				months: {width: '100%', maxWidth: '100%'},
				month: {width: '100%', maxWidth: '100%'},
			}}
		/>
	);
}


function CustomCalendarSelectDropdown(props: DropdownProps) {
	const {options, value, onChange} = props;
	const handleValueChange = (v: string) =>
		onChange?.({target: {value: v}} as React.ChangeEvent<HTMLSelectElement>);

	const normalize = (label: string) =>
		/^\d/.test(label) ? label : capitalizeFirst(label); // года не трогаем

	return (
		<Select value={value?.toString()} onValueChange={handleValueChange}>
			<SelectTrigger><SelectValue/></SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options?.map(o => (
						<SelectItem key={o.value} value={o.value.toString()} disabled={o.disabled}>
							{normalize(o.label)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
