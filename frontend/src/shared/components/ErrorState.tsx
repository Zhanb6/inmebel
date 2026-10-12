"use client"

import {useTranslation} from "@/i18n";
import {AlertTriangleIcon} from "lucide-react";

interface ErrorStateProps {
	title?: string;
	message?: string;
}

export function ErrorState({title, message}: ErrorStateProps) {
	const {t} = useTranslation("shared.components.ErrorState");

	return (
		<div className="w-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
			<div className="rounded-full bg-red-100 p-4 mb-4 dark:bg-red-900/50">
				<AlertTriangleIcon className="h-12 w-12 text-red-500 dark:text-red-400"/>
			</div>
			<h3 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-300">
				{title ?? t("An Error Occurred")}
			</h3>
			<p className="text-sm">
				{message ?? t("We couldn't load the data due to a server or network issue.")}
			</p>
		</div>
	);
}