/*
 * Copyright (c) 2025. Sayat Raykul
 */

import type {IPaginatedResponse, IResponse} from "@/shared";
import {clientApi} from "@/shared/client";
import type {ILessonSlot, IScheduleSearchParams} from "../../types";

export const getSchedules = (
	params?: IScheduleSearchParams
): Promise<IResponse<IPaginatedResponse<ILessonSlot>>> =>
	clientApi.getPaginated<ILessonSlot>("/api/v1/me/schedules", params);

export const getScheduleItem = (eventId: number): Promise<IResponse<ILessonSlot>> =>
	clientApi.get<ILessonSlot>(`/api/v1/schedules/${eventId}`);

