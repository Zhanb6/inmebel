import {useQuery} from "@tanstack/react-query";
import {getLessons} from "../services/client";
import {IPaginationParams} from "@/shared";

export const useLessonsQuery = (params?: IPaginationParams) => {
	return useQuery({
		queryKey: ["profile", "remaining-lessons"],
		queryFn: async () => {
			const response = await getLessons(params);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		}
	});
};