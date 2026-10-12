/*
 * Copyright (c) 2025. Sayat Raykul
 */

export interface IRegisterIn {
	phone: string;
	name: string;
	iin: string;
	address: string;
	password: string;
	password_confirmation: string;
	workshop_name?: string;
	workshop_bik?: string;
	workshop_bank?: string;
	workshop_director_name?: string;
	workshop_director_iic?: string;
	workshop_bc?: number;
	workshop_city?: string;
}

export interface IRegisterWorkshopIn {
	phone: string;
	name: string;
	workshop_name?: string;
	iin: string;
	address: string;
	password: string;
	password_confirmation: string;
		  workshop_bik?: string;
  workshop_bank?: string;
  workshop_director_name?: string;
  workshop_director_iic?: string;
  workshop_bc?: string | number; 
  workshop_city?: string;
}

export interface ILoginIn {
	phone: string;
	password: string;
	// remember?: boolean;
}

export interface IChangePasswordIn {
	old_password: string;
	new_password: string;
}

export interface IResetPasswordIn {
	email: string;
}

export interface IConfirmResetPasswordIn {
	email: string;
	otp: string;
}

export interface ISetNewPasswordIn {
	email: string;
	password: string;
	confirm: string;
}
