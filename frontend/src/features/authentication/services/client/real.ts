/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client"

import {clientApi, type IResponse, type ISuccessResponse} from "@/shared/client";
import type {IChangePasswordIn, IConfirmResetPasswordIn, IResetPasswordIn, ISetNewPasswordIn} from "../../types";

export const changePassword = async (
	payload: IChangePasswordIn,
) => {
	return clientApi.post<ISuccessResponse>("/api/auth/change-password", payload);
};

export const resetPassword = async (
	payload: IResetPasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	return clientApi.post<ISuccessResponse>("/api/auth/reset-password", payload);
};

export const confirmResetPassword = async (
	payload: IConfirmResetPasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	return clientApi.post<ISuccessResponse>("/api/auth/confirm-reset-password", payload);
};

export const setNewPassword = async (
	payload: ISetNewPasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	return clientApi.post<ISuccessResponse>("/api/auth/set-new-password", payload);
};

