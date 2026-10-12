import {useQuery} from "@tanstack/react-query";
import {getEvent, getEventsList} from "../services/client";
import {IPaginationParams} from "@/shared";

export const useEventsListQuery = (params?: IPaginationParams) => {
	return useQuery({
		queryKey: ["event", "list"],
		queryFn: async () => {
			const response = await getEventsList(params);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
		refetchInterval: 60_000,
	});
};

export const useEventQuery = (eventId: number) => {
	return useQuery({
		queryKey: ["events", eventId],
		queryFn: async () => {
			const response = await getEvent(eventId);
			if (!response.success) throw new Error(response.error); // ✅ Throw error so React Query can handle it
			return response.data;
		},
		refetchInterval: 60_000,
	});
}; 