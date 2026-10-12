export function EventCardSkeleton() {
	return (
		<div
			className="flex flex-col gap-2 p-4 bg-card rounded-2xl"
		>
			<span className="font-bold h-4 w-40 bg-card-foreground rounded-xl"></span>

			<span className="h-3 w-60 bg-card-foreground rounded-xl"></span>
			<span className="h-3 w-30 bg-card-foreground rounded-xl"></span>

			<div className="flex gap-2 text-sm opacity-80 h-3 w-40 bg-card-foreground rounded-xl"></div>
		</div>
	);
}
