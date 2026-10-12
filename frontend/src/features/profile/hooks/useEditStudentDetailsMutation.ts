import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import type {IEditStudentDetailsIn} from "../types";
import {editStudentDetails} from "@/features/profile/services/client";

export function useEditStudentDetailsMutation() {
	return useMutation({
		mutationFn: async (payload: IEditStudentDetailsIn) => {
			const response = await editStudentDetails(payload)
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
		retry: false,
		onError: (error) => {
			toast.error(error.message);
		},
	});
}
