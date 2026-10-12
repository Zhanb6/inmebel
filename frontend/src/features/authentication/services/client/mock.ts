/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {type IResponse, type ISuccessResponse, waitForSeconds} from "@/shared/client";
import type {IChangePasswordIn, IConfirmResetPasswordIn, IResetPasswordIn, ISetNewPasswordIn} from "../../types";

export const changePassword = async (
	payload: IChangePasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	await waitForSeconds(2)
	return {
		success: true,
		data: {
			message: "Success"
		}
	}
};

export const resetPassword = async (
	payload: IResetPasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	await waitForSeconds(2)
	return {
		success: true,
		data: {
			message: "Success"
		}
	}
};

export const confirmResetPassword = async (
	payload: IConfirmResetPasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	await waitForSeconds(2)
	return {
		success: true,
		data: {
			message: "Success"
		}
	}
};

export const setNewPassword = async (
	payload: ISetNewPasswordIn,
): Promise<IResponse<ISuccessResponse>> => {
	await waitForSeconds(2)
	return {
		success: true,
		data: {
			message: "Success"
		}
	}
};

