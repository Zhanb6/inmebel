import {useTranslation} from "@/i18n";
import {Separator} from "@/shared/components/ui";
import {Fragment} from "react";
import {cn} from "@/shared";
import {IConclusionItem} from "@/features/profile/types/conclusion";

interface ConclusionCardProps {
	items: IConclusionItem[]
}

export function ConclusionCard({items}: ConclusionCardProps) {
	const {t} = useTranslation("features.profile.components.ConclusionCard");
	const lessonsLength = items.length
	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-2">
			<div className="full flex items-center justify-between gap-2">
				<h3 className="font-bold text-xl">{t("Conclusion")}</h3>
			</div>

			<div className="flex flex-col justify-between gap-3">
				{items.map((lesson: IConclusionItem, index: number) => (
					<Fragment key={`lesson-${lesson.id}`}>
						<div className="full flex flex-col justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className={cn("size-4 rounded-full",
									lesson.is_seen ? "bg-accent" : "bg-destructive",
								)}></div>
								<span className="font-bold">{lesson.title}</span>
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
