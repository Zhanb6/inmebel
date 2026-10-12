/*
 * Copyright (c) 2025. Sayat Raykul
 */

import type {IPaginatedResponse, IResponse, ISearchParams} from "@/shared";
import {clientApi} from "@/shared/client";
import type {IActiveSubscriptionPlan, ISubscriptionPlan, ITransaction} from "../../types";

export const getTransactions = (
	params?: ISearchParams
): Promise<IResponse<IPaginatedResponse<ITransaction>>> =>
	clientApi.getPaginated<ITransaction>("/api/v1/me/transactions", params);

export const getTransaction = (transactionId: number): Promise<IResponse<ITransaction>> =>
	clientApi.get<ITransaction>(`/api/v1/transactions/${transactionId}`);

export const getSubscriptionPlans = (
	params?: ISearchParams
): Promise<IResponse<IPaginatedResponse<ISubscriptionPlan>>> =>
	clientApi.getPaginated<ISubscriptionPlan>("/api/v1/subscriptions/plans", params);

export const getActiveSubscription = (): Promise<IResponse<IActiveSubscriptionPlan>> =>
	clientApi.get<IActiveSubscriptionPlan>(`/api/v1/me/active-subscription`);

