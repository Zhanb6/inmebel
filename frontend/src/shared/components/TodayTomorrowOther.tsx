"use client"
import {addDays, format, isSameDay, startOfDay} from "date-fns";
import {type ComponentType, useMemo} from "react";
import {cn, combineDateAndTime, parseDateFromIso} from "../lib";
import {useTranslation} from "@/i18n";

interface IBaseTodayTomorrowOtherItem {
	id: number | string;
	date: string; // ISO date: yyyy-MM-dd
	time: string; // ISO time: HH-mm
}

export function useTodayTomorrowOther<T extends IBaseTodayTomorrowOtherItem>(
	items: T[] | undefined,
) {
	return useMemo(() => {
		const today = startOfDay(new Date());
		const tomorrow = addDays(today, 1);

		const all: T[] = items ?? [];

		const todayList: T[] = [];
		const tomorrowList: T[] = [];
		const otherByDate = new Map<string, { date: Date; items: T[] }>();

		for (const item of all) {
			if (!item?.date) continue;
			const d = parseDateFromIso(item.date);

			if (isSameDay(d, today)) {
				todayList.push(item);
			} else if (isSameDay(d, tomorrow)) {
				tomorrowList.push(item);
			} else {
				const key = format(d, "yyyy-MM-dd");
				const bucket = otherByDate.get(key) ?? {date: d, items: []};
				bucket.items.push(item);
				otherByDate.set(key, bucket);
			}
		}

		const byTime = (a: T, b: T) =>
			combineDateAndTime(a.date, a.time).getTime() - combineDateAndTime(b.date, b.time).getTime();

		todayList.sort(byTime);
		tomorrowList.sort(byTime);
		for (const [, bucket] of otherByDate) {
			bucket.items.sort(byTime);
		}

		const otherDatesSorted = [...otherByDate.values()]
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map(({date}) => format(date, "yyyy-MM-dd"));

		return {todayList, tomorrowList, otherByDate, otherDatesSorted};
	}, [items]);
}


type TTodayTomorrowOtherItemCard<T extends IBaseTodayTomorrowOtherItem> = ComponentType<{ item: T }>;

interface ITodayTomorrowOtherSectionProps<T extends IBaseTodayTomorrowOtherItem> {
	title: string;
	items: T[]
	Card: TTodayTomorrowOtherItemCard<T>
	className?: string
	classNames?: {
		container?: string,
		title?: string,
		itemsWrapper?: string,
	}
}

function TodayTomorrowOtherSection<T extends IBaseTodayTomorrowOtherItem>({
	title,
	items,
	Card,
	className,
	classNames,
}: ITodayTomorrowOtherSectionProps<T>) {
	return (
		<div className={cn("flex flex-col gap-3", className || classNames?.container)}>
			<h3 className={cn("text-lg font-semibold", classNames?.title)}>{title}</h3>
			<div className={cn("flex flex-col gap-4", classNames?.itemsWrapper)}>
				{items.map(item => (
					<Card key={`today-tomorrow-other-item-${item.id}`} item={item}/>
				))}
			</div>
		</div>
	);
}

interface ITodayTomorrowOtherWidgetProps<T extends IBaseTodayTomorrowOtherItem> {
	items: T[] | undefined
	Card: TTodayTomorrowOtherItemCard<T>
	className?: string
	classNames?: {
		container?: string;
		section?: {
			container?: string,
			title?: string,
			listWrapper?: string,
		};
	}
}

export function TodayTomorrowOtherWidget<T extends IBaseTodayTomorrowOtherItem>({
	items,
	Card,
	className,
	classNames,
}: ITodayTomorrowOtherWidgetProps<T>) {
	const {
		todayList,
		tomorrowList,
		otherByDate,
		otherDatesSorted
	} = useTodayTomorrowOther(items);
	const {t} = useTranslation("shared.components.TodayTomorrowOther")
	return (
		<div className={cn("w-full flex flex-col gap-6", className || classNames?.container)}>
			{todayList.length > 0 && (
				<TodayTomorrowOtherSection
					title={t("Today")}
					items={todayList}
					Card={Card}
					classNames={classNames?.section}
				/>
			)}
			{tomorrowList.length > 0 && (
				<TodayTomorrowOtherSection
					title={t("Tomorrow")}
					items={tomorrowList}
					Card={Card}
					classNames={classNames?.section}
				/>
			)}
			{otherDatesSorted.map(key => {
				const bucket = otherByDate.get(key);
				if (!bucket) return null;
				return (
					<TodayTomorrowOtherSection
						key={key}
						title={format(bucket.date, "dd-MM-yyyy")}
						items={bucket.items}
						Card={Card}
						classNames={classNames?.section}
					/>
				);
			})}
		</div>
	);
}

interface ITodayTomorrowOtherWidgetSkeletonProps {
	CardSkeleton: ComponentType
	className?: string
	classNames?: {
		container?: string;
		section?: {
			container?: string,
			title?: string,
			listWrapper?: string,
		};
	}
}

export function TodayTomorrowOtherWidgetSkeleton({
	CardSkeleton,
	className,
	classNames,
}: ITodayTomorrowOtherWidgetSkeletonProps) {
	return (
		<div className={cn("w-full flex flex-col gap-6 animate-pulse", className || classNames?.container)}>
			{Array.from({length: 2}).map((_, index) => {
				return (
					<TodayTomorrowOtherSectionSkeleton
						key={`section-${index}`}
						CardSkeleton={CardSkeleton}
						classNames={classNames?.section}
					/>
				);
			})}
		</div>
	);
}

interface ITodayTomorrowOtherSectionSkeletonProps {
	CardSkeleton: ComponentType
	className?: string
	classNames?: {
		container?: string,
		title?: string,
		itemsWrapper?: string,
	}
}

function TodayTomorrowOtherSectionSkeleton({
	CardSkeleton,
	className,
	classNames,
}: ITodayTomorrowOtherSectionSkeletonProps) {
	return (
		<div className={cn("flex flex-col gap-3", className || classNames?.container)}>
			<h3 className={cn("text-lg font-semibold h-4 w-40 bg-card-foreground rounded-xl", classNames?.title)}></h3>
			<div className={cn("flex flex-col gap-4", classNames?.itemsWrapper)}>
				{Array.from({length: 2}).map((_, index) => (
					<CardSkeleton key={`today-tomorrow-other-item-skeleton-${index}`}/>
				))}
			</div>
		</div>
	);
}
