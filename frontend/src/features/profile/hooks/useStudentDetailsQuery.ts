import {useQuery} from "@tanstack/react-query";
import {getStudentDetails} from "../services/client";

export const useStudentDetailsQuery = () => {
	return useQuery({
		queryKey: ["profile", "student-details"],
		queryFn: async () => {
			const response = await getStudentDetails();
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
	});
};