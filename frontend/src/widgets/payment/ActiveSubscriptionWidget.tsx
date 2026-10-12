import {useTranslation} from "@/i18n";
import {Conditional, EmptyState} from "@/shared/components";
import {
	ActiveSubscriptionPlanCard,
	ActiveSubscriptionPlanCardSkeleton,
	useActiveSubscriptionQuery,
	usePaymentScreenContext
} from "@/features/payment";


export function ActiveSubscriptionWidget() {
	const {t} = useTranslation("widgets.payment.ActiveSubscriptionWidget");
	const {setActiveWidget} = usePaymentScreenContext()
	const query = useActiveSubscriptionQuery()

	return (
		<div className="h-full flex flex-col gap-4">
			<div
				className="w-full h-12 shrink-0 flex items-center justify-between gap-2"
			>
				<h1 className="w-full flex items-center text-start gap-2 text-xl font-semibold truncate">
					{t("Your subscription")}
				</h1>
			</div>

			<div className="h-full flex flex-col gap-2">
				<Conditional
					query={query}
					skeleton={<ActiveSubscriptionPlanCardSkeleton/>}
					empty={
						<EmptyState
							message={
								t("You don't have a subscription plan.")
							}
						/>
					}
				>
					<ActiveSubscriptionPlanCard data={query.data!}/>
				</Conditional>
			</div>
			<button
				onClick={() => {
					setActiveWidget("plans")
				}}
				className="bg-button text-button-foreground cursor-pointer rounded-full p-2"
			>{t("Change subscription plan")}</button>
		</div>
	)
}