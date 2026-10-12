/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use server";
import {type IResponse, serverApi} from "@/shared/server";
import type {ILoginIn, ILoginOut, IRegisterIn, IRegisterWorkshopIn, ITokenOut,} from "../../types";
import type {IUser} from "next-auth";

export const registerUser = async (
	payload: IRegisterIn,
) =>
	serverApi.post<IUser>("/api/clients/register", payload);

export const registerWorkshop = async (
	payload: IRegisterWorkshopIn,
) =>
	serverApi.post<IUser>("/api/workshops/register", payload);

export const loginUser = async (
	payload: ILoginIn,
): Promise<IResponse<ILoginOut>> =>
	serverApi.post<ILoginOut>("/api/login/", payload);

export const refreshToken = async (
	refresh: string,
): Promise<IResponse<ITokenOut>> =>
	serverApi.post<ITokenOut>("/api/refresh-token", null, {headers:{
		Cookie: `refresh_token=${refresh}`
	}});
