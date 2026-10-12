export function ClientListItemSkeleton() {
	return (
		<div
			className="w-full flex items-center bg-card cursor-pointer rounded-xl p-4 gap-2 animate-pulse"
		>
			<div className="size-16">
				<img
					src="/assets/images/circle-user-round.svg"
					alt="user-logo"
					className="size-full"
				/>
			</div>
			<div className="flex flex-col items-start justify-center gap-3">
				<span className="h-4 w-30 bg-muted rounded-full"></span>
				<span className="h-3 w-25 bg-muted rounded-full"></span>
			</div>
		</div>
	)
}
