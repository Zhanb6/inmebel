import { useTranslation } from "@/i18n";
import { cn } from "@/shared";
import { Conditional, IconButton } from "@/shared/components";
import { CalendarDaysIcon } from "lucide-react";
import { EventsWidget, EventsWidgetSkeleton } from "@/widgets/events";
import { useEventsListQuery } from "@/features/events";

export default function EventsScreen() {
  const { t } = useTranslation("screens.events.EventsScreen");
  const eventsListQuery = useEventsListQuery();

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className={cn(
          "w-full h-12 shrink-0 grid grid-cols-[3rem_1fr_3rem] items-center justify-between justify-items-center gap-2",
        )}
      >
        <div className="w-full flex items-center justify-center gap-2">
          {
            <IconButton
              icon={<CalendarDaysIcon />}
              className="size-8 bg-button-muted"
              variant="ghost"
              aria-label="calendar"
            />
          }
        </div>
        <div className="w-full flex items-center justify-center text-xl font-semibold truncate">
          {t("Events")}
        </div>
        <div className="flex items-center gap-2">
          {
            <IconButton
              icon={
                <img src="/assets/images/circle-user-round.svg" alt="profile" />
              }
              className="size-10"
              aria-label="calendar"
            />
          }
        </div>
      </div>
      <Conditional query={eventsListQuery} skeleton={<EventsWidgetSkeleton />}>
        <EventsWidget data={eventsListQuery.data} />
      </Conditional>
    </div>
  );
}
