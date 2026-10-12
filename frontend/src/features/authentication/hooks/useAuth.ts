/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client"

import {signIn, signOut} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {tokenStore} from "@/shared";
import type {
	IChangePasswordIn,
	IConfirmResetPasswordIn,
	ILoginIn,
	IRegisterIn,
	IResetPasswordIn,
	ISetNewPasswordIn
} from "../types";
import {changePassword, confirmResetPassword, resetPassword, setNewPassword} from "../services/client";
import { logoutProfile } from "@/features/profiles";

const QUERY_KEYS = {
	session: ["session"],
	profile: ["profile"],
};

export function useLoginMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (credentials: ILoginIn) => {
			const response = await signIn("login", {
				...credentials,
				redirect: false, // Prevent full-page reload
			});
			if (response?.error) throw new Error(response.code);
			return response;
		},
		retry: false,
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: QUERY_KEYS.session});
			await queryClient.invalidateQueries({queryKey: QUERY_KEYS.profile});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

export function useRegisterMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (credentials: IRegisterIn) => {
			const response = await signIn("register", {
				...credentials,
				redirect: false,
			});
			
			// Улучшенная обработка ошибок
			if (response?.error) {
				// Если есть response.code, используем его, иначе используем error
				const errorMessage = response.code || response.error || "Unknown error";
				throw new Error(errorMessage);
			}
			
			if (!response) {
				throw new Error("No response from server");
			}
			
			console.log("Registration response:", response);
			return response;
		},
		retry: false,
		onSuccess: async () => {
			await queryClient.invalidateQueries({queryKey: QUERY_KEYS.session});
			await queryClient.invalidateQueries({queryKey: QUERY_KEYS.profile});
		},
		onError: (error) => {
			// Отображаем понятное сообщение об ошибке
			toast.error(error.message || "Registration failed");
		},
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await logoutProfile();
			
			tokenStore.clear();
			await signOut({redirect: false});
		},
		retry: false,
		onSuccess: async () => {
			queryClient.setQueryData(QUERY_KEYS.session, null);
			queryClient.removeQueries({queryKey: QUERY_KEYS.profile});
			await queryClient.invalidateQueries({queryKey: QUERY_KEYS.session});
		},
	});
}

export function useChangePasswordMutation() {
	return useMutation({
		mutationFn: async (payload: IChangePasswordIn) => {
			const response = await changePassword(payload)
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

export function useResetPasswordMutation() {
	return useMutation({
		mutationFn: async (payload: IResetPasswordIn) => {
			const response = await resetPassword(payload)
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}

export function useConfirmResetPasswordMutation() {
	return useMutation({
		mutationFn: async (payload: IConfirmResetPasswordIn) => {
			const response = await confirmResetPassword(payload)
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}


export function useSetNewPasswordMutation() {
	return useMutation({
		mutationFn: async (payload: ISetNewPasswordIn) => {
			const response = await setNewPassword(payload)
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
}
