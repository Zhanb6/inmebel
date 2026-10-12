import {useTranslation} from "@/i18n";
import {Conditional, IconButton} from "@/shared/components";
import {
	type ISubscriptionPlan,
	NewSubscriptionPlanCard,
	NewSubscriptionPlanCardSkeleton,
	useSubscriptionPlansQuery,
	useTariffsScreenContext
} from "@/features/payment";
import {useState} from "react";
import {PlusIcon} from "lucide-react";


export function TariffPackagesWidget() {
	const {t} = useTranslation("widgets.tariffs.TariffPackagesWidget");
	const {setActiveWidget} = useTariffsScreenContext()
	const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlan | null>(null)
	const query = useSubscriptionPlansQuery()
	return (
		<div className="h-full flex flex-col gap-4">
			<div
				className="w-full h-12 shrink-0 flex items-center justify-between gap-2"
			>
				<h3 className="w-full flex items-center text-start gap-2 text-xl font-semibold truncate">
					{t("Packages")}
				</h3>
				<div className="flex items-center gap-2">{
					<IconButton
						icon={<PlusIcon className="size-6"/>}
						variant="secondary"
						className="size-9"
						onClick={(e) => {
							e.preventDefault();
							setActiveWidget("create")
						}}
					/>
				}</div>

			</div>
			<div className="flex flex-col gap-4 pb-4">
				<Conditional
					query={query}
					skeleton={
						<>
							{Array.from({length: 2}).map((_, index) => (
								<NewSubscriptionPlanCardSkeleton
									key={`plan-skeleton-${index}`}
								/>
							))}
						</>
					}
				>
					{query.data?.results.map((item, i) => (
						<NewSubscriptionPlanCard
							key={`plan-${item.id}`}
							data={item}
							isSelected={selectedPlan?.id === item.id}
							onClick={setSelectedPlan}
						/>
					))}
				</Conditional>
			</div>
		</div>
	)
}