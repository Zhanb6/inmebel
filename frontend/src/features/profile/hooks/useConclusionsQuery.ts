import {useQuery} from "@tanstack/react-query";
import {getConclusions} from "../services/client";
import {IPaginationParams} from "@/shared";

export const useConclusionsQuery = (params?: IPaginationParams) => {
	return useQuery({
		queryKey: ["profile", "conclusions"],
		queryFn: async () => {
			const response = await getConclusions(params);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		}
	});
};