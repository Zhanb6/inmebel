/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {type IPaginatedResponse, IPaginationParams, type IResponse, waitForSeconds} from "@/shared/client";
import type {IProfile} from "@/features/profile";
import type {IClientIn} from "@/features/clients";

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

export const getClients = async (params?: IPaginationParams): Promise<IResponse<IPaginatedResponse<IProfile>>> => {
	await waitForSeconds(2);
	const clientsList = [
		adminProfile,
		adminProfile,
		userProfile,
		userProfile,
	]
	return {
		success: true,
		data: {
			count: clientsList.length,
			previous: null,
			next: null,
			results: clientsList
		}
	}
}
export const createClient = async (payload: IClientIn): Promise<IResponse<IProfile>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: userProfile
	}
}