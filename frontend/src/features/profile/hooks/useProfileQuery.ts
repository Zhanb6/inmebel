import {useQuery} from "@tanstack/react-query";
import {getProfile} from "../services/client";

export const useProfileQuery = () => {
	return useQuery({
		queryKey: ["profile", "me"],
		queryFn: async () => {
			const response = await getProfile();
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
	});
};