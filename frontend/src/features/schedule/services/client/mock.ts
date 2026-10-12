/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {IPaginatedResponse, type IResponse, waitForSeconds} from "@/shared/client";
import type {ILessonSlot, IScheduleSearchParams, ITeacher} from "../../types";
import {compareAsc, parseISO} from "date-fns";

const teacher: ITeacher = {
	id: 1,
	email: "admin@gmail.com",
	phone: "+77770001234",
	firstname: "Жанна",
	lastname: "Кожамуратовна",
	full_name: "Жанна Кожамуратовна",
	initials: "ЖК",
	created_at: "2011-11-04T00:05:23Z",
	updated_at: "2011-11-04T00:05:23Z",
	is_active: true,
	is_staff: true,
	is_superuser: true,
}

const scheduleList: ILessonSlot[] = [
	{
		id: 1,
		teacher: teacher,
		title: "Вводное Занятие",
		date: "2025-10-06",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",

	},
	{
		id: 2,
		teacher: teacher,
		title: "Артикуляционные упражнения",
		date: "2025-10-07",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",

	},
	{
		id: 3,
		teacher: teacher,
		title: "Звуковая диагностика",
		date: "2025-01-12",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",

	},
	{
		id: 4,
		teacher: teacher,
		title: "Постановка звуков",
		date: "2025-01-12",
		time: "11:20",
		created_at: "2011-11-04T00:05:23Z",
		updated_at: "2011-11-04T00:05:23Z",
	}
]

export const getSchedules = async (params?: IScheduleSearchParams): Promise<IResponse<IPaginatedResponse<ILessonSlot>>> => {
	await waitForSeconds(2);
	const from = params?.from ?? "";
	const to = params?.to ?? "";

	const fromDate = from ? parseISO(from) : null;
	const toDate = to ? parseISO(to) : null;

	const filteredList = scheduleList.filter(schedule => {
		const scheduleDate = parseISO(schedule.date);
		const afterFrom = fromDate ? compareAsc(scheduleDate, fromDate) >= 0 : true;
		const beforeTo = toDate ? compareAsc(scheduleDate, toDate) <= 0 : true;
		return afterFrom && beforeTo;
	});

	return {
		success: true,
		data: {
			count: filteredList.length,
			previous: null,
			next: null,
			results: filteredList
		},
	};
};

export const getScheduleItem = async (eventId: number): Promise<IResponse<ILessonSlot>> => {
	await waitForSeconds(2);
	const event = scheduleList[eventId];
	return {
		success: true,
		data: event,
	};
};

