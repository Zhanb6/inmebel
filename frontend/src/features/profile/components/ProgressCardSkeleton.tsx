import {Separator} from "@/shared/components/ui";
import {Fragment} from "react";
import {cn} from "@/shared";

export function ProgressCardSkeleton() {
	const itemsCount = 5
	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-4 animate-pulse">
			<div className="full flex items-center justify-between gap-2">
				<h3 className="h-4 w-30 rounded-full bg-primary"></h3>
			</div>

			<div className="flex flex-col justify-between gap-3">
				{Array.from({length: itemsCount}).map((_, index: number) => (
					<Fragment key={`lesson-skeleton-${index}`}>
						<div className="full flex flex-col justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className={cn("size-4 rounded-full",
									index % 2 === 0 ? "bg-accent" : "bg-destructive",
								)}></div>
								<span className="h-3 w-30 rounded-full bg-primary"></span>
							</div>
							<span className="h-2 w-full rounded-full bg-card-foreground"></span>
							<span className="h-2 w-2/3 rounded-full bg-card-foreground"></span>
						</div>
						{index < itemsCount - 1 && <Separator className="bg-separator"/>}
					</Fragment>
				))}
			</div>
		</div>
	)
}
