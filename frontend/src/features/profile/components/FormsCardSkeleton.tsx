"use client"
import {Separator} from "@/shared/components/ui";
import {FolderSVG, IconButton} from "@/shared/components";
import {EyeIcon} from "lucide-react"
import {Fragment} from "react";

export function FormsCardSkeleton() {
	const itemsCount = 3
	return (
		<div className="w-full flex flex-col bg-card rounded-2xl border border-card p-5 gap-4 animate-pulse">
			<div className="full flex items-center justify-between">
				<h3 className="h-4 w-30 bg-foreground rounded-full"></h3>
			</div>

			<div className="flex flex-col justify-between gap-3">
				{Array.from({length: itemsCount}).map((_, index) => {
					return (
						<Fragment key={`form-card-skeleton-${index}`}>
							<div className="full grid grid-cols-[3rem_1fr_2rem] items-center justify-between gap-2">
								<FolderSVG className="size-12"/>
								<div className="flex flex-col gap-2">
									<div className="h-3 w-full bg-foreground rounded-full"></div>
									<span className="h-3 w-30 bg-foreground rounded-full">
									</span>
								</div>
								<IconButton
									aria-label="edit"
									icon={<EyeIcon/>}
									className="size-8 bg-background"
								/>
							</div>
							{index < itemsCount - 1 && <Separator className="bg-separator"/>}
						</Fragment>
					)
				})}
			</div>
		</div>
	)
}
