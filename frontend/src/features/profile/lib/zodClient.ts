/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";

import {useTranslation} from "@/i18n";
import {createEditStudentDetailsSchema,} from "./zod";
import {z} from "zod";

export function useEditStudentDetailsSchema() {
	const {t} = useTranslation("features.profile.lib.zod");
	return createEditStudentDetailsSchema(t);
}

export type TEditStudentDetailsSchema = z.infer<
	ReturnType<typeof useEditStudentDetailsSchema>
>;