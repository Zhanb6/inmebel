/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {IPaginatedResponse, IPaginationParams, IResponse} from "@/shared";
import {clientApi} from "@/shared/client";
import type {IEventItem} from "../../types";

export const getEventsList = (
	params?: IPaginationParams,): Promise<IResponse<IPaginatedResponse<IEventItem>>> =>
	clientApi.getPaginated<IEventItem>("/api/v1/events/list", params);

export const getEvent = (eventId: number): Promise<IResponse<IEventItem>> =>
	clientApi.get<IEventItem>(`/api/v1/events/${eventId}`);

