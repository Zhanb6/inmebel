/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {IPaginatedResponse, type IResponse, ISearchParams, waitForSeconds} from "@/shared/client";
import {
	EBankCardType,
	type IActiveSubscriptionPlan,
	IBankCard,
	IBankCardType,
	type ISubscriptionPlan,
	ITransaction
} from "../../types";
import {IProfile} from "@/features/profile";

const user: IProfile = {
	id: 1,
	email: "admin@gmail.com",
	phone: "+77770001234",
	firstname: "Жанна",
	lastname: "Кожамуратовна",
	full_name: "Жанна Кожамуратовна",
	initials: "ЖК",
	created_at: "2011-11-04T00:05:23Z",
	updated_at: "2011-11-04T00:05:23Z",
	is_active: true,
	is_staff: true,
	is_superuser: true,
}

const mastercardCardType: IBankCardType = {
	id: 1,
	label: "MasterCard",
	value: EBankCardType.MASTERCARD,
}

const visaCardType: IBankCardType = {
	id: 2,
	label: "Visa",
	value: EBankCardType.VISA,
}

const mastercardBankCard: IBankCard = {
	card_number: "1234567812345678",
	card_type: mastercardCardType,
	user: user,
	cvv: "123",
	is_active: true,
	cardholder_name: "ZHANNA KOZHAMURATOVNA",
	expiration_date: "2011-11-04T00:05:23Z",
}

const visaBankCard: IBankCard = {
	card_number: "1234567812345678",
	card_type: visaCardType,
	user: user,
	cvv: "123",
	is_active: true,
	cardholder_name: "ZHANNA KOZHAMURATOVNA",
	expiration_date: "2011-11-04T00:05:23Z",
}

const transactions: ITransaction[] = [
	{
		id: "id_1",
		amount: 100000,
		transaction_datetime: "2011-11-04T00:05:23Z",
		transaction_type: "PAYMENT",
		status: "COMPLETED",
		card: mastercardBankCard,
		merchant_name: "ИП \"Рога и копыта\"",
		description: "Test transaction",
		reference_number: "reference_1",
	},
	{
		id: "id_2",
		amount: 200000,
		transaction_datetime: "2011-11-04T00:05:23Z",
		transaction_type: "PAYMENT",
		status: "COMPLETED",
		card: mastercardBankCard,
		merchant_name: "ИП \"Рога и копыта\"",
		description: "Test transaction",
		reference_number: "reference_2",
	},
	{
		id: "id_3",
		amount: 200000,
		transaction_datetime: "2011-11-04T00:05:23Z",
		transaction_type: "REFUND",
		status: "COMPLETED",
		card: visaBankCard,
		merchant_name: "ИП \"Рога и копыта\"",
		description: "Test transaction",
		reference_number: "reference_3",
	},
	{
		id: "id_4",
		amount: 150000,
		transaction_datetime: "2011-11-04T00:05:23Z",
		transaction_type: "REFUND",
		status: "COMPLETED",
		card: visaBankCard,
		merchant_name: "ИП \"Рога и копыта\"",
		description: "Test transaction",
		reference_number: "reference_4",
	},
	{
		id: "id_5",
		amount: 200000,
		transaction_datetime: "2011-11-04T00:05:23Z",
		transaction_type: "PAYMENT",
		status: "COMPLETED",
		card: visaBankCard,
		merchant_name: "ИП \"Рога и копыта\"",
		description: "Test transaction",
		reference_number: "reference_5",
	},
]

export const getTransactions = async (params?: ISearchParams): Promise<IResponse<IPaginatedResponse<ITransaction>>> => {
	await waitForSeconds(2);

	return {
		success: true,
		data: {
			count: transactions.length,
			previous: null,
			next: null,
			results: transactions
		},
	};
};

export const getTransaction = async (transactionId: number): Promise<IResponse<ITransaction>> => {
	await waitForSeconds(2);
	return {
		success: true,
		data: transactions[transactionId],
	};
};

const subscriptionPlans: ISubscriptionPlan[] = [
	{
		id: 1,
		name: "Подписка на 12 занятии",
		description: "",
		is_active: true,
		number_of_lessons: 12,
		test_price: {
			cost: 100,
			currency: "tenge",
			currencyPosition: "end",
		},
		price: {
			cost: 120000,
			currency: "tenge",
			currencyPosition: "end",
		},
		is_profitable: true,
	},
	{
		id: 2,
		name: "Подписка на 8 занятии",
		description: "",
		is_active: false,
		number_of_lessons: 8,
		test_price: {
			cost: 100,
			currency: "tenge",
			currencyPosition: "end",
		},
		price: {
			cost: 100000,
			currency: "tenge",
			currencyPosition: "end",
		},
		is_profitable: false,
	}
]

export const getSubscriptionPlans = async (
	params?: ISearchParams
): Promise<IResponse<IPaginatedResponse<ISubscriptionPlan>>> => {
	await waitForSeconds(2)
	return {
		success: true,
		data: {
			count: subscriptionPlans.length,
			previous: null,
			next: null,
			results: subscriptionPlans
		}
	}
}


const activeSubscriptionPlan: IActiveSubscriptionPlan = {
	id: 1,
	name: "Подписка на 12 занятии",
	description: "",
	is_active: true,
	number_of_lessons: 12,
	number_of_remaining_lessons: 5,
	test_price: {
		cost: 100,
		currency: "tenge",
		currencyPosition: "end",
	},
	price: {
		cost: 120000,
		currency: "tenge",
		currencyPosition: "end",
	},
	is_profitable: true,
}


export const getActiveSubscription = async (): Promise<IResponse<IActiveSubscriptionPlan>> => {
	await waitForSeconds(2)
	return {
		success: true,
		data: activeSubscriptionPlan
	}
}
