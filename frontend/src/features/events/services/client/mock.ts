/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {IPaginatedResponse, IPaginationParams, type IResponse, waitForSeconds} from "@/shared/client";
import type {IEventItem} from "../../types";

const eventsList: IEventItem[] = [
	{
		id: 1,
		title: "Вводное Занятие",
		description: "Знакомство с методикой, целью курса, постановка первых задач",
		date: "2025-10-06",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",

	},
	{
		id: 2,
		title: "Артикуляционные упражнения",
		description: "Работа с артикуляцией, постановка правильного положения органов речи.",
		date: "2025-10-07",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",

	},
	{
		id: 3,
		title: "Звуковая диагностика",
		description: "Определение проблемных звуков, оценка уровня речи ребёнка.",
		date: "2025-01-12",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",

	},
	{
		id: 4,
		title: "Постановка звуков",
		description: "Индивидуальная работа над конкретными звуками (Р, Л, Ш, С и др.).",
		date: "2025-01-12",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",
	}
]

export const getEventsList = async (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IEventItem>>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: {
			count: eventsList.length,
			previous: null,
			next: null,
			results: eventsList
		},
	};
};

export const getEvent = async (eventId: number): Promise<IResponse<IEventItem>> => {
	await waitForSeconds(2);
	const event = eventsList[eventId];
	return {
		success: true,
		data: event,
	};
};

