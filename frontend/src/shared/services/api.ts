// Centralized error extraction
import type {TFunction, TNamespaceTranslationKeys} from "@/i18n";
import axios, {AxiosInstance, type AxiosRequestConfig} from "axios";
import {buildQueryParams, DEFAULT_PAGINATION_PARAMS} from "../lib";
import type {IErrorResponse, IPaginatedResponse, IPaginationParams, IResponse} from "../types";


export function extractErrorMessage(
	error: unknown,
	t: TFunction<"shared.services.api">,
): string {
	// console.log(chalk.yellow(error));

	if (!axios.isAxiosError(error)) {
		return t("Unknown Error");
	}
  
	const {response, code, message} = error;

	if (!response) {
		const translated = t(code as TNamespaceTranslationKeys["shared.services.api"], {});
		return translated !== code ? translated : (message || t("Unknown Error"));
	}

	const {
		code: resCode,
		message: resMessage,
		detail,
	} = (response.data as IErrorResponse) || {};

	let detailMessage = "";
	if (detail) {
		if (typeof detail === "string") {
			detailMessage = detail;
		} else if (typeof detail === "object") {
			try {
				detailMessage = JSON.stringify(detail, null, 2);
			} catch {
				detailMessage = String(detail);
			}
		}
	}

	const translated = resCode
		? t(resCode as TNamespaceTranslationKeys["shared.services.api"])
		: "";

	const baseMessage =
		translated !== resCode ? translated : resMessage || t("Unknown Error");

	return detailMessage ? `${baseMessage}\n\n${detailMessage}` : baseMessage;
}


export function makeApiWithHandler(
	http: AxiosInstance,
	t: TFunction<"shared.services.api">,
) {
	async function handleResponse<T>(req: Promise<any>): Promise<IResponse<T>> {
		try {
			const res = await req;
			return {success: true, data: res.data as T};
		} catch (e) {
			return {success: false, error: extractErrorMessage(e, t)};
		}
	}

	return {
		get: <T>(url: string, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.get(url, config)),

		getPaginated: <T>(
			url: string,
			params: IPaginationParams = DEFAULT_PAGINATION_PARAMS,
			config?: AxiosRequestConfig,
		) => {
			const q = buildQueryParams({...DEFAULT_PAGINATION_PARAMS, ...params});
			return handleResponse<IPaginatedResponse<T>>(http.get(`${url}${q}`, config));
		},

		post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.post(url, data, config)),

		postPaginated: <T>(
			url: string,
			data?: unknown,
			params: IPaginationParams = DEFAULT_PAGINATION_PARAMS,
			config?: AxiosRequestConfig,
		) => {
			const q = buildQueryParams({...DEFAULT_PAGINATION_PARAMS, ...params});
			return handleResponse<IPaginatedResponse<T>>(http.post(`${url}${q}`, data, config));
		},

		patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.patch(url, data, config)),
		put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.put(url, data, config)),
		delete: <T>(url: string, config?: AxiosRequestConfig) =>
			handleResponse<T>(http.delete(url, config)),
	};
}


export function dummyTranslationsForScanner(
	t: TFunction<"shared.services.api">,
) {
	// Static error keys to be translated automatically by i18next-scanner
	// These are predefined error codes, and i18next-scanner will automatically generate their translations
	// Make sure to add dynamic backend-specific error codes here manually (as they are context-dependent).
	// After adding new error codes, run the `smart-i18n` task to update translations.
	return [
		// Axios-specific codes
		t("ERR_FR_TOO_MANY_REDIRECTS"),
		t("ERR_BAD_OPTION_VALUE"),
		t("ERR_BAD_OPTION"),
		t("ERR_NETWORK"),
		t("ERR_DEPRECATED"),
		t("ERR_BAD_RESPONSE"),
		t("ERR_BAD_REQUEST"),
		t("ERR_NOT_SUPPORT"),
		t("ERR_INVALID_URL"),
		t("ERR_CANCELED"),

		// Node.js low-level network errors
		t("ECONNREFUSED"),
		t("ECONNRESET"),
		t("ETIMEDOUT"),
		t("EHOSTUNREACH"),
		t("ENETUNREACH"),
		t("EAI_AGAIN"),
		t("ENOTFOUND"),
		t("EPIPE"),
		t("EACCES"),
		t("ECONNABORTED"),

		t("CITY_NOT_FOUND"),
		t("USER_NOT_FOUND"),
		t("RESIDENT_QUESTIONNAIRE_NOT_FOUND"),
		t("CONTENT_NOT_FOUND"),
		t("GATHERING_EVENT_NOT_FOUND"),
		t("RESIDENT_NOT_FOUND"),
		t("REVIEW_NOT_FOUND"),
		t("ALREADY_REACTED"),
		t("ALREADY_REVIEWED"),
		t("REVIEW_SELF"),
		t("ALREADY_SENT"),
		t("FILE_NOT_FOUND"),
		t("SUBSCRIPTION_PLAN_NOT_FOUND"),
		t("USER_EXISTS"),
		t("UPDATE_DATA_ERROR"),
		t("VALIDATION_ERROR"),
		t("PAYMENT_AMOUNT_MISMATCH"),
		t("PARTIAL_PAYMENT"),
		t("RESIDENT_QUESTIONNAIRE_ALREADY_EXISTS"),
		t("INVALID_IMAGE_FORMAT"),
		t("IMAGE_TOO_LARGE"),
		t("CREATE_DATA_ERROR"),
		t("ALREADY_SCHEDULED"),
		t("WEBAPP_AUTH_ERROR"),
		t("TELEGRAM_ERROR"),
		t("INVALID_RECEIPT_DOCUMENT"),
		t("RECEIPT_PARSE_ERROR"),
		t("AMOUNT_DOES_NOT_MATCH_PLAN"),
	];
}
