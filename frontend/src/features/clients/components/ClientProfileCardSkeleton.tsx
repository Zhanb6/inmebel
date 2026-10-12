"use client"
import {EmailSVG, PhoneSVG} from "@/shared/components";
import {Separator} from "@/shared/components/ui";
import {cn} from "@/shared";

export function ClientProfileCardSkeleton() {
	return (
		<div className="w-full flex flex-col rounded-2xl border border-card p-5 gap-2 animate-pulse">
			<div className="flex items-center gap-4">
				<div className="size-20">
					<img
						src="/assets/images/circle-user-round.svg"
						alt="user-logo"
						className="size-full"
					/>
				</div>
				<div className="flex flex-col items-start justify-center gap-2">
					<span className="bg-primary h-4 w-30 rounded-full"></span>
					<span className="bg-accent h-4 w-20 rounded-full"></span>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-col justify-between gap-2">
					<span className="bg-muted h-3 w-30 rounded-full"></span>
					<span className="bg-primary h-3 w-30 rounded-full"></span>
				</div>
			</div>

			<div className="flex flex-col justify-between gap-3 p-4 bg-card rounded-2xl">
				<div className="flex items-center gap-2">
					<EmailSVG className="text-icon-muted"/>
					<span className="bg-primary h-3 w-30 rounded-full"></span>
				</div>
				<Separator className="bg-separator"/>
				<div className="flex items-center gap-2">
					<PhoneSVG className="text-icon-muted"/>
					<span className="bg-primary h-3 w-30 rounded-full"></span>
				</div>
			</div>
			<div className="w-full flex items-center justify-center">
			</div>
			<ClientProfileStatusSkeleton/>
		</div>
	)
}

function ClientProfileStatusSkeleton() {
	return (
		<div className="flex flex-col justify-between gap-2">
			<div className="flex items-center gap-2">
				<span className="bg-muted h-3 w-10 rounded-full"></span>
				<span className="bg-primary h-3 w-30 rounded-full"></span>
			</div>
			<div className="flex items-center gap-2">
				{Array.from({length: 6}).map((_, i) => (
					<div key={`status-pill-${i}`} className={cn(
						"rounded-full h-2 w-8",
						i < 2 ? "bg-accent" : "bg-muted"
					)}></div>
				))}
			</div>
		</div>
	);
}
