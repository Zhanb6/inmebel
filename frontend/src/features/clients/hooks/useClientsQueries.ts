import {useMutation, useQuery} from "@tanstack/react-query";
import {createClient, getClients} from "../services/client";
import {IPaginationParams} from "@/shared";
import {toast} from "react-toastify";
import {IClientIn} from "@/features/clients";

export const useClientsQuery = (params?: IPaginationParams) => {
	return useQuery({
		queryKey: ["clients", params],
		queryFn: async () => {
			const response = await getClients(params);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
	});
};

export const useCreateClientMutation = () => {
	return useMutation({
		mutationFn: async (payload: IClientIn) => {
			const response = await createClient(payload);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
		retry: false,
		onError: (error) => {
			toast.error(error.message);
		},
	});
};