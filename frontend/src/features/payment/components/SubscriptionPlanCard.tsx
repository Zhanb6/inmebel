import {useTranslation} from "@/i18n";
import {cn, price2String} from "@/shared";
import {ISubscriptionPlan} from "../types";
import {CheckIcon} from "lucide-react";

interface ISubscriptionPlanCardProps {
	data: ISubscriptionPlan,
	isSelected: boolean,
	onClick?: (plan: ISubscriptionPlan) => void,
}

export function SubscriptionPlanCard({
	data,
	isSelected,
	onClick
}: ISubscriptionPlanCardProps) {
	const {t} = useTranslation("features.payment.components.SubscriptionPlanCard");

	return (
		<div
			className={cn(
				"relative rounded-xl cursor-pointer",
				isSelected ? "border border-accent" : "bg-card"
			)}
			onClick={() => onClick && onClick(data)}
		>
			<div className="relative absolute top-0 left-0 right-0">
				{isSelected && <div className="absolute -top-2 -left-1 size-6 rounded-full bg-accent p-1 pt-1.5">
            <CheckIcon color="var(--background)" className="size-full"/>
        </div>}

				{data.is_profitable && <div
            className="absolute -top-1/2 -right-3 -translate-y-1/2 rounded-full bg-accent text-primary-foreground text-sm px-2 py-1"
        >
            <span>{t("Profitable")}</span>
        </div>}
			</div>
			<div className="flex flex-col gap-1 p-4">
				<span className="text-md font-bold">
					{t("Subscription for {{number}} lessons", {
						number: data.number_of_lessons
					})}
				</span>
				<span className="text-sm">
					{t("Verification payment - {{cost}}", {
						cost: price2String(data.test_price)
					})}
				</span>
				<span className="text-sm">
					{t("Subscription cost - {{cost}}", {
						cost: price2String(data.price)
					})}
				</span>
			</div>
		</div>
	)
}