/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use server";

import {getTranslation} from "@/i18n/lib/server";
import {createLoginSchema, createRegisterSchema,} from "./zod";

export async function getRegisterSchema() {
  const {t} = await getTranslation("features.authentication.lib.zod");
  return createRegisterSchema();
}

export async function getLoginSchema() {
  const {t} = await getTranslation("features.authentication.lib.zod");
  return createLoginSchema();
}
