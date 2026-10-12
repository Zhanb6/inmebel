import {useTranslation} from "@/i18n";
import {IActiveSubscriptionPlan} from "../types";

interface IActiveSubscriptionPlanCardProps {
	data: IActiveSubscriptionPlan,
}

export function ActiveSubscriptionPlanCard({
	data
}: IActiveSubscriptionPlanCardProps) {
	const {t} = useTranslation("features.payment.components.ActiveSubscriptionPlanCard");

	return (
		<div className="flex flex-col bg-card border border-separator rounded-xl">
			<span className="text-md font-bold p-4 pb-2">
				{t("Subscription for {{number}} lessons", {
					number: data.number_of_lessons
				})}
			</span>
			<div className="w-full h-px bg-separator"></div>
			<div className="grid grid-cols-2 gap-2 text-sm p-4 pt-2">
				<span>{t("Name")}</span>
				<span>{data.name}</span>

				<span>{t("Lessons")}</span>
				<span>{data.number_of_lessons}</span>

				<span>{t("Past lessons")}</span>
				<span>{data.number_of_lessons - data.number_of_remaining_lessons}</span>

				<span>{t("Remaining lessons")}</span>
				<span>{data.number_of_remaining_lessons}</span>
			</div>
		</div>
	)
}