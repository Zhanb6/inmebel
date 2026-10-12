/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";

import {useTranslation} from "@/i18n";
import {createCreateSubscriptionPlanSchema} from "./zod";
import {z} from "zod";

export function useCreateSubscriptionPlanSchema() {
	const {t} = useTranslation("features.payment.lib.zod");
	return createCreateSubscriptionPlanSchema(t);
}

export type TCreateSubscriptionPlanSchema = z.infer<
	ReturnType<typeof useCreateSubscriptionPlanSchema>
>;