"use client"
import {FolderSVG} from "@/shared/components";

export function FormCardSkeleton() {
	return (
		<div className="w-full flex flex-col items-center justify-between gap-4 p-6 rounded-2xl bg-card animate-pulse">
			<div className="w-full grid grid-cols-[3rem_1fr] items-center justify-between gap-2">
				<FolderSVG className="size-12"/>
				<div className="flex flex-col gap-3">
					<span className="h-4 w-30 bg-muted rounded-full"></span>
					<span className="h-3 w-20 bg-muted rounded-full"></span>
				</div>
			</div>
			<button
				className="w-full flex items-center justify-center py-3 px-2 rounded-full bg-background"
			>
				<span className="h-4 w-20 bg-muted rounded-full"></span>
			</button>
		</div>
	)
}
