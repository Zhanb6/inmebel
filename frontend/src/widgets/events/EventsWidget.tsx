"use client";

import {EventCard, EventCardSkeleton, type IEventItem} from "@/features/events";
import {type IPaginatedResponse, TodayTomorrowOtherWidget, TodayTomorrowOtherWidgetSkeleton} from "@/shared/client";

interface IEventsWidgetProps {
	data?: IPaginatedResponse<IEventItem> | undefined
}

export function EventsWidget({data}: IEventsWidgetProps) {
	return <TodayTomorrowOtherWidget<IEventItem> items={data?.results} Card={EventCard}/>;
}


export function EventsWidgetSkeleton() {
	return <TodayTomorrowOtherWidgetSkeleton CardSkeleton={EventCardSkeleton}/>;
}


