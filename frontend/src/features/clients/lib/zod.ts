/*
 * Copyright (c) 2025. Sayat Raykul
 */

import {z} from "zod";
import {TFunction} from "@/i18n";

const emailField = (t: TFunction<"features.profile.lib.zod">) =>
	z.string({required_error: t("Email is required")})
	.min(1, t("Email is required"))
	.trim()
	.toLowerCase()
	.email(t("Email is invalid"));

const passwordField = (t: TFunction<"features.profile.lib.zod">) =>
	z.string({required_error: t("Password is required")})
	.min(8, t("Password must be at least {{symbols}} symbols", {symbols: 8}))
	.max(128, t("Password must be at most {{symbols}} symbols", {symbols: 128}))
	// хотя бы одна строчная, одна заглавная, одна цифра; остальное — любые символы
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, t("Password is weak"));

const otpField = (t: TFunction<"features.profile.lib.zod">) =>
	z.string({required_error: t("OTP is required")})
	.regex(/^\d{4}$/, t("Enter 4-digit code"))

export const createCreateClientSchema = (
	t: TFunction<"features.clients.lib.zod">,
) => {
	return z.object({
		firstname: z.string({required_error: t("Firstname is required")}).trim().min(1, t("Firstname is required")),
		lastname: z.string({required_error: t("Lastname is required")}).trim().min(1, t("Lastname is required")),
		speechTherapyConclusion: z.string({required_error: t("Speech-Language therapist's conclusion is required")}).trim().min(1, t("Lastname is required")),
		email: emailField(t),
		password: passwordField(t),
		confirm: z.string({required_error: t("Password is required")}),
	})
	.refine((data) => data.password === data.confirm, {
		message: t("Password and Confirm mismatch"),
		path: ["confirm"],
	});
};
