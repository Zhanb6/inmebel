/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";

import {useTranslation} from "@/i18n";
import {
	createChangePasswordSchema,
	createConfirmResetPasswordSchema,
	createLoginSchema,
	createRegisterSchema,
	createRegisterWorkshopSchema,
	createResetPasswordSchema,
	createSetNewPasswordSchema,
} from "./zod";
import {z} from "zod";

export function useRegisterSchema() {
	const {t} = useTranslation("features.authentication.lib.zod");
	return createRegisterSchema();
}

export type TRegisterSchema = z.infer<
	ReturnType<typeof useRegisterSchema>
>;

export function useRegisterWorkshopSchema() {
	return createRegisterWorkshopSchema();
}

export type TRegisterWorkshopSchema = z.infer<
	ReturnType<typeof useRegisterWorkshopSchema>
>;



export function useLoginSchema() {
	const {t} = useTranslation("features.authentication.lib.zod");
	return createLoginSchema();
}

export type TLoginSchema = z.infer<
	ReturnType<typeof useLoginSchema>
>;

export function useChangePasswordSchema() {
	const {t} = useTranslation("features.authentication.lib.zod");
	return createChangePasswordSchema();
}

export type TChangePasswordSchema = z.infer<
	ReturnType<typeof useChangePasswordSchema>
>;

export function useResetPasswordSchema() {
	const {t} = useTranslation("features.authentication.lib.zod");
	return createResetPasswordSchema();
}

export type TResetPasswordSchema = z.infer<
	ReturnType<typeof useResetPasswordSchema>
>;

export function useConfirmResetPasswordSchema() {
	const {t} = useTranslation("features.authentication.lib.zod");
	return createConfirmResetPasswordSchema();
}

export type TConfirmResetPasswordSchema = z.infer<
	ReturnType<typeof useConfirmResetPasswordSchema>
>;

export function useSetNewPasswordSchema() {
	const {t} = useTranslation("features.authentication.lib.zod");
	return createSetNewPasswordSchema();
}

export type TSetNewPasswordSchema = z.infer<
	ReturnType<typeof useSetNewPasswordSchema>
>;
