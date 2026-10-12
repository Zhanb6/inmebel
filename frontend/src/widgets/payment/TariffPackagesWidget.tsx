import {useTranslation} from "@/i18n";
import {Checkbox, Conditional, IconButton} from "@/shared/components";
import {
	type ISubscriptionPlan,
	SubscriptionPlanCard,
	SubscriptionPlanCardSkeleton,
	usePaymentScreenContext,
	useSubscriptionPlansQuery
} from "@/features/payment";
import {useState} from "react";
import {ArrowLeft} from "lucide-react";


export function TariffPackagesWidget() {
	const {t} = useTranslation("widgets.payment.TariffPackagesWidget");
	const {setActiveWidget} = usePaymentScreenContext()
	const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlan | null>(null)
	const query = useSubscriptionPlansQuery()
	return (
		<div className="h-full flex flex-col gap-4">
			<div
				className="w-full h-12 shrink-0 flex items-center justify-between gap-2"
			>
				<IconButton
					aria-label={"back"}
					variant="secondary"
					className="size-9"
					onClick={(event) => {
						event.preventDefault()
						setActiveWidget("main")
					}}
					icon={
						<ArrowLeft
							className="size-6"
						/>
					}
				/>
				<h3 className="w-full flex items-center text-start gap-2 text-xl font-semibold truncate">
					{t("Packages")}
				</h3>
			</div>

			<div className="h-full flex flex-col gap-4 pb-4 justify-between">
				<div className="flex flex-col gap-4">
					<h1 className="w-full flex items-center text-start gap-2 text-xl font-semibold">
						{t("Speech therapist rates are available by subscription.")}
					</h1>
					<div className="flex flex-col gap-4 pb-4">
						<Checkbox
							label={t("Live communication")}
							labelClassName="text-sm font-normal"
							className="data-[state=checked]:bg-button"
						/>
						<Checkbox
							label={t("Individual approach")}
							labelClassName="text-sm font-normal"
							className="data-[state=checked]:bg-button"
						/>
						<Checkbox
							label={t("Systemic result")}
							labelClassName="text-sm font-normal"
							className="data-[state=checked]:bg-button"
						/>
					</div>
					<div className="flex flex-col gap-4 pb-4">
						<Conditional
							query={query}
							skeleton={
								<>
									{Array.from({length: 2}).map((_, index) => (
										<SubscriptionPlanCardSkeleton
											key={`plan-skeleton-${index}`}
										/>
									))}
								</>
							}
						>
							{query.data?.results.map((item, i) => (
								<SubscriptionPlanCard
									key={`plan-${item.id}`}
									data={item}
									isSelected={selectedPlan?.id === item.id}
									onClick={setSelectedPlan}
								/>
							))}
						</Conditional>
					</div>
				</div>
			</div>
			<button
				onClick={() => {
					setActiveWidget("pay")
				}}
				className="bg-button text-button-foreground cursor-pointer rounded-full p-2"
			>{t("Subscribe")}</button>
		</div>
	)
}