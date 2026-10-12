import {useQuery} from "@tanstack/react-query";
import {getScheduleItem, getSchedules} from "@/features/schedule/services/client";
import {IScheduleSearchParams} from "@/features/schedule";

export const useSchedulesQuery = (params?: IScheduleSearchParams) => {
	return useQuery({
		queryKey: ["me", "schedules", params],
		queryFn: async () => {
			const response = await getSchedules(params);
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
	});
};

export const useScheduleItemQuery = (eventId: number) => {
	return useQuery({
		queryKey: ["schedules", eventId],
		queryFn: async () => {
			const response = await getScheduleItem(eventId);
			if (!response.success) throw new Error(response.error);
			return response.data;
		},
	});
};