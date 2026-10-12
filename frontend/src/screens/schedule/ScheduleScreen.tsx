import {cn} from "@/shared";
import {Conditional, IconButton} from "@/shared/components";
import {CalendarDaysIcon} from "lucide-react";
import {useTranslation} from "@/i18n";
import {ScheduleWidget, ScheduleWidgetSkeleton} from "@/widgets/schedule/ScheduleWidget";
import {ScheduleDatePicker, useSchedulesQuery} from "@/features/schedule";
import {Separator} from "@/shared/components/ui";
import React, {useState} from "react";

export default function ScheduleScreen() {
	const {t} = useTranslation("screens.schedule.ScheduleScreen")
	const [selected, setSelected] = useState<Date | undefined>();
	const selectedDateString = selected ? new Date(selected).toISOString() : undefined
	const schedulesQuery = useSchedulesQuery({
		from: selectedDateString,
		to: selectedDateString
	})
	return (
		<div className="w-full flex flex-col gap-4">
			<div
				className={cn(
					"w-full h-12 shrink-0 grid grid-cols-[3rem_1fr_3rem] items-center justify-between justify-items-center gap-2",
				)}
			>
				<div className="w-full flex items-center justify-center gap-2">{
					<IconButton
						icon={
							<CalendarDaysIcon/>
						}
						className="size-8 bg-button-muted"
						variant="ghost"
						aria-label="calendar"
					/>
				}</div>
				<div className="w-full flex items-center justify-center text-xl font-semibold truncate">
					{t("Schedule")}
				</div>
				<div className="flex items-center gap-2">{
					<IconButton
						icon={
							<img
								src="/assets/images/circle-user-round.svg"
								alt="profile"
							/>
						}
						className="size-10"
						aria-label="calendar"
					/>
				}</div>
			</div>


			<div className="w-full flex flex-col items-center rounded-2xl border border-card p-4 gap-5">
				<ScheduleDatePicker selected={selected} onSelect={setSelected}/>

				<Separator className="bg-separator"/>

				<div className="w-full flex flex-col gap-1">

					<h3 className="w-full text-lg items-start font-bold">{t("Active")}</h3>

					<Conditional
						query={schedulesQuery}
						skeleton={<ScheduleWidgetSkeleton/>}
					>
						<ScheduleWidget data={schedulesQuery.data}/>
					</Conditional>
				</div>
			</div>
		</div>
	)
}
