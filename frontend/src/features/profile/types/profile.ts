export interface IProfile {
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

export interface IStudent {
	id: number;
	email: string;
	phone: string;
	firstname: string;
	lastname: string;
	full_name: string;
	birthdate: string;
	created_at: string;
	updated_at: string;
	diagnosis: string;
}