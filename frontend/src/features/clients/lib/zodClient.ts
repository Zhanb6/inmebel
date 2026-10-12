/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";

import {useTranslation} from "@/i18n";
import {createCreateClientSchema,} from "./zod";
import {z} from "zod";

export function useCreateClientSchema() {
	const {t} = useTranslation("features.clients.lib.zod");
	return createCreateClientSchema(t);
}

export type TCreateClientSchema = z.infer<
	ReturnType<typeof useCreateClientSchema>
>;