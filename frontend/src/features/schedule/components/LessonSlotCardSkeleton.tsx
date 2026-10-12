import {Separator} from "@/shared/components/ui";

export function LessonSlotCardSkeleton() {
	return (
		<div
			className="w-full min-h-20 h-20 py-4 px-2 gap-2 grid grid-cols-[4rem_4px_1fr] items-center justify-between bg-card rounded-xl"
		>
			<span className="bg-card-foreground rounded-full text-center h-5"></span>
			<Separator orientation="vertical" className="bg-separator !w-[4px] rounded-full"/>
			<div className="w-full flex flex-col items-start gap-x-2 overflow-hidden">
				<span className="w-2/3 h-4 bg-card-foreground rounded-full truncate "></span>
				<span className="w-1/2 h-3 mt-2 bg-muted rounded-full truncate"></span>
			</div>
		</div>
	)
}