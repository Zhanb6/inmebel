export function ActiveSubscriptionPlanCardSkeleton() {

	return (
		<div className="flex flex-col bg-card border border-separator rounded-xl animate-pulse">
			<div className="p-4">
				<div className="h-4 w-35 bg-muted rounded-full"></div>
			</div>
			<div className="w-full h-px bg-separator"></div>
			<div className="grid grid-cols-2 gap-4 text-sm p-4">
				<div className="h-3 w-10 bg-muted rounded-full"></div>
				<div className="h-3 w-30 bg-muted rounded-full"></div>

				<div className="h-3 w-14 bg-muted rounded-full"></div>
				<div className="h-3 w-10 bg-muted rounded-full"></div>

				<div className="h-3 w-18 bg-muted rounded-full"></div>
				<div className="h-3 w-10 bg-muted rounded-full"></div>

				<div className="h-3 w-22 bg-muted rounded-full"></div>
				<div className="h-3 w-10 bg-muted rounded-full"></div>
			</div>
		</div>
	)
}