export function NewSubscriptionPlanCardSkeleton() {

	return (
		<div
			className="rounded-xl cursor-pointer bg-card animate-pulse"
		>
			<div className="flex flex-col gap-4 p-4">
				<span className="h-4 w-30 bg-muted rounded-full"></span>
				<span className="h-3 w-45 bg-muted rounded-full"></span>
				<span className="h-3 w-50 bg-muted rounded-full"></span>
			</div>
		</div>
	)
}