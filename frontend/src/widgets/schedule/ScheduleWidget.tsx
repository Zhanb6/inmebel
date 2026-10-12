"use client"

import {type ILessonSlot, LessonSlotCard, LessonSlotCardSkeleton} from "@/features/schedule";
import {type IPaginatedResponse, TodayTomorrowOtherWidget, TodayTomorrowOtherWidgetSkeleton} from "@/shared/client";

interface ScheduleWidgetProps {
	data?: IPaginatedResponse<ILessonSlot> | undefined
}

export function ScheduleWidget({data}: ScheduleWidgetProps) {
	return <TodayTomorrowOtherWidget<ILessonSlot> items={data?.results} Card={LessonSlotCard}/>;
}

export function ScheduleWidgetSkeleton() {
	return <TodayTomorrowOtherWidgetSkeleton CardSkeleton={LessonSlotCardSkeleton}/>;
}
