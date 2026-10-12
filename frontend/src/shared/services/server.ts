/*
 * Copyright (c) 2025. Sayat Raykul
 */

import "server-only";
import axios, {AxiosRequestConfig} from "axios";
import {env} from "../config/env/server";
import {getTranslation} from "@/i18n/lib/server";
import {makeApiWithHandler} from "./api";
import {cache} from "react";

const apiClient = axios.create({
	baseURL: env.API_URL,
	headers: {"Content-Type": "application/json"},
});


const getServerApi = cache(async () => {
	const {t} = await getTranslation("shared.services.api");
	return makeApiWithHandler(apiClient, t);
});

export const serverApi = {
	get: async <T>(url: string, config?: AxiosRequestConfig) =>
		(await getServerApi()).get<T>(url, config),

	getPaginated: async <T>(url: string, params?: any, config?: AxiosRequestConfig) =>
		(await getServerApi()).getPaginated<T>(url, params, config),

	post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		(await getServerApi()).post<T>(url, data, config),

	postPaginated: async <T>(url: string, data?: unknown, params?: any, config?: AxiosRequestConfig) =>
		(await getServerApi()).postPaginated<T>(url, data, params, config),

	patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		(await getServerApi()).patch<T>(url, data, config),

	put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		(await getServerApi()).put<T>(url, data, config),

	delete: async <T>(url: string, config?: AxiosRequestConfig) =>
		(await getServerApi()).delete<T>(url, config),
};
