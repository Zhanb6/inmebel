import {useQuery} from "@tanstack/react-query";
import {getTransaction, getTransactions} from "../services/client";
import type {IPaginatedResponse, ISearchParams} from "@/shared";
import {convertTransaction} from "../lib";
import type {IFilteredTransaction} from "../types";

export const useTransactionsQuery = (params?: ISearchParams) => {
	return useQuery({
		queryKey: ["me", "transactions", params],
		queryFn: async () => {
			const response = await getTransactions(params);
			if (!response.success) throw new Error(response.error);
			const {count, next, previous, results} = response.data;
			const filteredTransactions = results?.map(convertTransaction)
			const filteredResponse: IPaginatedResponse<IFilteredTransaction> = {
				count,
				next,
				previous,
				results: filteredTransactions,
			}
			return filteredResponse
		},
	});
};

export const useTransactionQuery = (transactionId: number) => {
	return useQuery({
		queryKey: ["transactions", transactionId],
		queryFn: async () => {
			const response = await getTransaction(transactionId);
			if (!response.success) throw new Error(response.error);
			return convertTransaction(response.data);
		},
	});
};