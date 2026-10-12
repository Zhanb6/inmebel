"use client"

import {useTranslation} from "@/i18n";
import {PackageOpenIcon} from "lucide-react";

interface EmptyStateProps {
	title?: string;
	message?: string;
}

export function EmptyState({title, message}: EmptyStateProps) {
	const {t} = useTranslation("shared.components.EmptyState");

	return (
		<div className="w-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
			<div className="rounded-full bg-secondary p-4 mb-4">
				<PackageOpenIcon className="h-12 w-12 text-primary"/>
			</div>
			<h3 className="text-xl font-semibold mb-2">
				{title ?? t("No Data Found")}
			</h3>
			<p className="text-sm">
				{message ?? t("There's nothing to show here yet.")}
			</p>
		</div>
	);
}
