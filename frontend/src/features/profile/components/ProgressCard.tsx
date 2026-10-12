"use client"
import {useTranslation} from "@/i18n";
import {Separator} from "@/shared/components/ui";
import type {ILesson} from "@/features/profile";
import {Fragment} from "react";
import {cn} from "@/shared";

interface ProgressCardProps {
	lessons: ILesson[]
}

export function ProgressCard({lessons}: ProgressCardProps) {
	const {t} = useTranslation("features.profile.components.ProgressCard");
	const lessonsLength = lessons.length
	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-2">
			<div className="full flex items-center justify-between gap-2">
				<h3 className="font-bold text-xl">{t("Progress")}</h3>
			</div>

			<div className="flex flex-col justify-between gap-3">
				{lessons.map((lesson: ILesson, index: number) => (
					<Fragment key={`lesson-${lesson.id}`}>
						<div className="full flex flex-col justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className={cn("size-4 rounded-full",
									lesson.is_done ? "bg-accent" : "bg-destructive",
								)}></div>
								<span className="font-bold">
									{t("Lesson {{number}}", {
										number: index
									})}
								</span>
							</div>
							<span>
								{lesson.description}
							</span>
						</div>
						{index < lessonsLength - 1 && <Separator className="bg-separator"/>}
					</Fragment>
				))}
			</div>
		</div>
	)
}
