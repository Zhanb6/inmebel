import {IPaginationParams} from "@/shared";

export interface IScheduleSearchParams extends IPaginationParams {
	from?: string;
	to?: string;
	status?: string;
}

export interface ILessonSlot {
	id: number;
	teacher: ITeacher;
	title: string;
	date: string;
	time: string;
	created_at: string;
	updated_at: string;
}

export interface ITeacher {
	id: number;
	email: string;
	phone: string;
	firstname: string;
	lastname: string;
	full_name: string;
	initials: string;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean
}