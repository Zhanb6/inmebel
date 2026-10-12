import {useQuery} from "@tanstack/react-query";
import {IPaginationParams} from "@/shared";
import {getForms} from "../services/client";

export const useFormsQuery = (params?: IPaginationParams) => {
	return useQuery({
		queryKey: ["profile", "forms"],
		queryFn: async () => {
			const response = await getForms(params);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
	});
};