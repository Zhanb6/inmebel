import {useQuery} from "@tanstack/react-query";
import type {ISearchParams} from "@/shared";
import {getActiveSubscription, getSubscriptionPlans} from "../services/client";

export const useSubscriptionPlansQuery = (params?: ISearchParams) => {
	return useQuery({
		queryKey: ["subscription", "plans", params],
		queryFn: async () => {
			const response = await getSubscriptionPlans(params);
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
	});
};

export const useActiveSubscriptionQuery = () => {
	return useQuery({
		queryKey: ["me", "active-subscription"],
		queryFn: async () => {
			const response = await getActiveSubscription();
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
	});
};