import type {IEventItem} from "@/features/events";

export function EventCard({item}: { item: IEventItem }) {
	return (
		<div
			className="flex flex-col gap-2 p-4 bg-card rounded-2xl"
		>
			<span className="font-bold">{item.title}</span>
			{item.description && (
				<span className="text-card-foreground">{item.description}</span>
			)}
			<div className="flex gap-2 text-sm opacity-80">
				<span>{item.date}</span>
				{item.time && <span>{item.time}</span>}
			</div>
		</div>
	);
}
