import {Conditional, IconButton} from "@/shared/components";
import {cn} from "@/shared";
import {useTranslation} from "@/i18n";
import {UserPlusIcon} from "lucide-react";
import {ClientListItem, ClientListItemSkeleton, useClientsQuery, useClientsScreenContext} from "@/features/clients";

export function ClientsListWidget() {
	const {t} = useTranslation("widgets.clients.ClientsListWidget")
	const query = useClientsQuery()

	const {setActiveWidget, setSelectedClient} = useClientsScreenContext()
	return (
		<div className="w-full flex flex-col gap-4">
			<div
				className={cn(
					"w-full h-12 shrink-0 flex items-center justify-between gap-2",
				)}
			>
				<div className="w-full flex items-center text-xl font-semibold truncate">
					{t("Clients")}
				</div>
				<div className="flex items-center gap-2">{
					<IconButton
						icon={<UserPlusIcon className="size-6"/>}
						variant="secondary"
						className="size-9"
						onClick={(e) => {
							e.preventDefault();
							setActiveWidget("create")
						}}
					/>
				}</div>

			</div>
			<div className="flex flex-col gap-4 pb-4">
				<Conditional
					query={query}
					skeleton={
						<>
							{Array.from({length: 2}).map((_, index) => (
								<ClientListItemSkeleton
									key={`client-skeleton-${index}`}
								/>
							))}
						</>
					}
				>
					{query.data?.results.map((item, index) => (
						<ClientListItem
							key={`client-${item.id}-${index}`}
							profile={item}
							onClick={(profile) => {
								setSelectedClient(profile)
								setActiveWidget("detail")
							}}
						/>
					))}
				</Conditional>
			</div>

		</div>
	)
}
