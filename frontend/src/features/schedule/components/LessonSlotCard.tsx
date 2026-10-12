import {ILessonSlot} from "@/features/schedule";
import {Separator} from "@/shared/components/ui";

export function LessonSlotCard({item}: { item: ILessonSlot }) {
	return (
		<div
			className="w-full min-h-20 h-20 py-4 px-2 gap-2 grid grid-cols-[4rem_4px_1fr] items-center justify-between bg-card rounded-xl"
		>
			<span className="text-lg font-bold text-center">{item.time}</span>
			<Separator orientation="vertical" className="bg-separator !w-[4px] rounded-full"/>
			<div className="w-full flex flex-col items-start gap-x-2 overflow-hidden">
				<span className="w-full text-sm font-bold truncate ">{item.teacher.full_name}</span>
				<span className="w-full text-xs text-muted truncate">{item.title}</span>
			</div>
		</div>
	)
}