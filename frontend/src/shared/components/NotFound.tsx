/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client"

import Link from "next/link";
import {useTranslation} from "@/i18n";

export function NotFound() {
	const {t} = useTranslation("shared.components.NotFound");

	return (
		<div className="flex flex-col w-full h-full items-center justify-center">
			<h1 className="text-5xl">{t("404 Not found")}</h1>
			<img
				src="/assets/confused-travolta.gif"
				alt="Not found"
				className="object-cover"
			/>
			<Link href="/">{t("Return Home")}</Link>
		</div>
	);
}
