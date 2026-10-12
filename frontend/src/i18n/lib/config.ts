/*
 * Copyright (c) 2025. Sayat Raykul
 */

export const languages = ["kk", "ru", "en", "ru-RU"] as const;
export type TLanguage = (typeof languages)[number];
export const FALLBACK_LANGUAGE: TLanguage = "ru";
export const COOKIE_NAME = "NEXT_LANGUAGE";
export const defaultNS = "translation";
