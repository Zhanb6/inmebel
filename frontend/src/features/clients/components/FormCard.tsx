"use client"
import {useTranslation} from "@/i18n";
import {FolderSVG} from "@/shared/components";
import {IForm} from "@/features/profile";

interface IFormsCardProps {
	item: IForm
}

export function FormCard({item}: IFormsCardProps) {
	const {t} = useTranslation("features.clients.components.FormCard");

	return (
		<div className="w-full flex flex-col items-center justify-between gap-4 p-6 rounded-2xl bg-card">
			<div className="w-full grid grid-cols-[3rem_1fr] items-center justify-between gap-2">
				<FolderSVG className="size-12"/>
				<div className="flex flex-col">
					<span className="font-bold">{item.name}</span>
					<span>
					{t("Form {{date}}", {
						date: item.date
					})}
				</span>
				</div>
			</div>
			<button
				className="w-full flex items-center justify-center py-2 px-2 rounded-full bg-background"
			>
				{t("Fill out the form")}
			</button>
		</div>
	)
}
