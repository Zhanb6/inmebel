/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {type IPaginatedResponse, IPaginationParams, type IResponse, waitForSeconds} from "@/shared/client";
import type {IConclusionItem, IEditStudentDetailsIn, IForm, ILesson, IProfile, IStudent,} from "../../types";

import {getSession} from "next-auth/react";

const adminProfile: IProfile = {
	id: 1,
	email: "admin@gmail.com",
	phone: "+77770001234",
	firstname: "Admin",
	lastname: "Admin",
	full_name: "Admin Admin",
	initials: "AA",
	created_at: "2011-11-04T00:05:23Z",
	updated_at: "2011-11-04T00:05:23Z",
	is_active: true,
	is_staff: true,
	is_superuser: true,
};

const userProfile: IProfile = {
	id: 2,
	email: "user@gmail.com",
	phone: "+77770001234",
	firstname: "User",
	lastname: "User",
	full_name: "User User",
	initials: "UU",
	created_at: "2011-11-04T00:05:23Z",
	updated_at: "2011-11-04T00:05:23Z",
	is_active: true,
	is_staff: true,
	is_superuser: false,
};

export const getProfile = async (): Promise<IResponse<IProfile>> => {
	await waitForSeconds(2);
	const session = await getSession();
	console.log({session})
	const id = session?.user?.id;
	const profile = id === "1" ? adminProfile : userProfile
	return {
		success: true,
		data: profile,
	};
};

export const getStudentDetails = async (): Promise<IResponse<IStudent>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: {
			id: 1,
			email: "student@gmail.com",
			phone: "+77770001234",
			firstname: "Student",
			lastname: "Student",
			full_name: "Student Student",
			birthdate: "2011-11-04T00:05:23Z",
			created_at: "2011-11-04T00:05:23Z",
			updated_at: "2011-11-04T00:05:23Z",
			diagnosis: "Test diagnosis",
		},
	};
};

export const getForms = async (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IForm>>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: {
			count: 3,
			previous: null,
			next: null,
			results: [
				{
					id: 1,
					name: "Ата-аналарға арналған сауалнама",
					date: "2025-02-20",
				},
				{
					id: 2,
					name: "Диагностика",
					date: "2025-02-20",
				},
				{
					id: 3,
					name: "Бланк конструкторы",
					date: "2025-02-20",
				},
			]
		},
	};
};

export const editStudentDetails = async (payload: IEditStudentDetailsIn): Promise<IResponse<IStudent>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: {
			id: 1,
			email: "student@gmail.com",
			phone: "+77770001234",
			firstname: "Student",
			lastname: "Student",
			full_name: "Student Student",
			birthdate: "2011-11-04T00:05:23Z",
			created_at: "2011-11-04T00:05:23Z",
			updated_at: "2011-11-04T00:05:23Z",
			diagnosis: "Test diagnosis",
		},
	};
};

export const getLessons = async (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<ILesson>>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: {
			count: 10,
			previous: null,
			next: null,
			results: [
				{
					id: 1,
					description: "Feedback from the recent interview with David Clark was positive for the Senior Software Developer position.",
					is_done: true,
					date: "2025-05-10",
				},
				{
					id: 2,
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_done: true,
					date: "2025-05-10",
				},
				{
					id: 3,
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_done: true,
					date: "2025-05-10",
				},
				{
					id: 4,
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_done: true,
					date: "2025-05-10",
				},
				{
					id: 5,
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_done: false,
					date: "2025-05-10",
				},
				{
					id: 6,
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_done: false,
					date: "2025-05-10",
				},
			]
		},
	};
};


export const getConclusions = async (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IConclusionItem>>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: {
			count: 10,
			previous: null,
			next: null,
			results: [
				{
					id: 1,
					title: "Заключение",
					description: "Feedback from the recent interview with David Clark was positive for the Senior Software Developer position.",
					is_seen: true,
					date: "2025-05-10",
				},
				{
					id: 2,
					title: "Прогноз развития речи",
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_seen: true,
					date: "2025-05-10",
				},
				{
					id: 3,
					title: "Коррекционный маршрут",
					description: "Lisa Williams withdrew her application for the Senior Software Developer role.",
					is_seen: false,
					date: "2025-05-10",
				},
			]
		},
	};
};
