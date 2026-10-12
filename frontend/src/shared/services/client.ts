/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";
import axios from "axios";
import {env} from "../config/env/client";
import {tokenStore,} from "../lib";
import {makeApiWithHandler} from "./api";
import {getSession} from "next-auth/react";
import i18next from "i18next";


// Create an Axios instance for client-side requests
const apiClient = axios.create({
	baseURL: env.NEXT_PUBLIC_API_URL, // Replace with your API URL
	headers: {"Content-Type": "application/json"},
});

apiClient.interceptors.request.use(
	async (config) => {
		const token = tokenStore.get();
    
		if (token) {
			config.headers.Authorization = `${token.access}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor to handle 401 errors
let unauthorizedCount = 0;
let isRedirecting = false;

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			unauthorizedCount++;
			
			// Если 3 ошибки подряд и редирект еще не выполняется
			if (unauthorizedCount >= 3 && !isRedirecting) {
				isRedirecting = true;
				
				if (typeof window !== 'undefined') {
					window.location.href = "/auth";
				}
			}
		} else {
			// При успешном запросе или другой ошибке - сбрасываем счетчик
			unauthorizedCount = 0;
		}
		
		return Promise.reject(error);
	},
);
const tNs = ((k: string, opts?: any) =>
	i18next.t(k, {ns: "shared.services.api", ...opts})) as any;

export const clientApi = makeApiWithHandler(apiClient, tNs);




const formDataClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,

});


formDataClient.interceptors.request.use(
  	async (config) => {
		const token = tokenStore.get();
    
		if (token) {
			config.headers.Authorization = `${token.access}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

formDataClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // tokenStore.clear();
      console.warn("⚠️ Unauthorized! Signing out...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const formDataApi = makeApiWithHandler(formDataClient, tNs);