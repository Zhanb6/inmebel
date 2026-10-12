"use client"
import {Separator} from "@/shared/components/ui";

export function StudentDetailsCardSkeleton() {
	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-4 animate-pulse">
			<div className="full flex items-center justify-between gap-2">
				<h3 className="bg-primary h-4 w-35 rounded-full"></h3>
				<button
					className="bg-background px-3 py-1.5 rounded-full"
				>
					<div className="bg-card-foreground h-2.5 w-20 rounded-full"></div>
				</button>
			</div>

			<div className="flex flex-col justify-between gap-3">
				<div className="full flex items-center justify-between gap-2">
					<div className="bg-card-foreground h-3.5 w-10 rounded-full"></div>
					<div className="bg-primary h-3 w-40 rounded-full"></div>
				</div>
				<Separator className="bg-separator"/>
				<div className="full flex items-center justify-between gap-2">
					<div className="bg-card-foreground h-3.5 w-30 rounded-full"></div>
					<div className="bg-primary h-3 w-20 rounded-full"></div>
				</div>
				<Separator className="bg-separator"/>
				<div className="full flex items-center justify-between gap-2">
					<div className="bg-card-foreground h-3.5 w-12 rounded-full"></div>
					<div className="bg-primary h-3 w-42 rounded-full"></div>
				</div>
				<Separator className="bg-separator"/>
				<div className="full flex items-center justify-between gap-2">
					<div className="bg-card-foreground h-3.5 w-16 rounded-full"></div>
					<div className="bg-primary h-3 w-30 rounded-full"></div>
				</div>
			</div>

		</div>
	)
}
