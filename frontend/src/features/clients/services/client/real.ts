/*
 * Copyright (c) 2025. Sayat Raykul
 */
"use client"

import {clientApi, type IPaginatedResponse, IPaginationParams, type IResponse} from "@/shared/client";
import type {IProfile,} from "@/features/profile";
import type {IClientIn} from "@/features/clients";

export const getClients = (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IProfile>>> =>
	clientApi.get<IPaginatedResponse<IProfile>>("/api/v1/clients");

export const createClient = (payload: IClientIn): Promise<IResponse<IProfile>> =>
	clientApi.post<IProfile>("/api/v1/clients", payload);
