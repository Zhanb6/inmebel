"use client"
import {useTranslation} from "@/i18n";
import {Separator} from "@/shared/components/ui";
import {FolderSVG, IconButton} from "@/shared/components";
import {EyeIcon} from "lucide-react"
import {IForm} from "@/features/profile";
import {Fragment} from "react";

interface IFormsCardProps {
	items: IForm[]
}

export function FormsCard({items}: IFormsCardProps) {
	const {t} = useTranslation("features.profile.components.FormsCard");
	const lessonsLength = items.length

	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-4">
			<div className="full flex items-center justify-between gap-2">
				<h3 className="font-bold text-xl">{t("Forms")}</h3>
			</div>

			<div className="flex flex-col justify-between gap-3">
				{items.map((item, index) => {
					return (
						<Fragment key={`form-card-${index}`}>
							<div className="w-full grid grid-cols-[3rem_1fr_2rem] items-center justify-between gap-2">
								<FolderSVG className="size-12"/>
								<div className="flex flex-col">
									<span className="font-bold">{item.name}</span>
									<span>
										{t("Form {{date}}", {
											date: item.date
										})}
									</span>
								</div>
								<IconButton
									aria-label="edit"
									icon={<EyeIcon/>}
									className="size-8 bg-background"
								/>
							</div>
							{index < lessonsLength - 1 && <Separator className="bg-separator"/>}
						</Fragment>
					)
				})}
			</div>
		</div>
	)
}
