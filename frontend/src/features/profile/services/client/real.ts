/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {clientApi, type IPaginatedResponse, IPaginationParams, type IResponse} from "@/shared/client";
import type {IConclusionItem, IEditStudentDetailsIn, IForm, ILesson, IProfile, IStudent,} from "../../types";

export const getProfile = (): Promise<IResponse<IProfile>> =>
	clientApi.get<IProfile>("/api/me");

export const getStudentDetails = (): Promise<IResponse<IStudent>> =>
	clientApi.get<IStudent>("/api/v1/profile/student-details");

export const getForms = (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IForm>>> =>
	clientApi.get<IPaginatedResponse<IForm>>("/api/v1/profile/forms");

export const editStudentDetails = (payload: IEditStudentDetailsIn): Promise<IResponse<IStudent>> =>
	clientApi.post<IStudent>("/api/v1/profile/student-details");

export const getLessons = (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<ILesson>>> =>
	clientApi.get<IPaginatedResponse<ILesson>>("/api/v1/profile/classes");

export const getConclusions = (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IConclusionItem>>> =>
	clientApi.get<IPaginatedResponse<IConclusionItem>>("/api/v1/profile/conclusions");
