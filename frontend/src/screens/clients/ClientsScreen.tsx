import {useClientsScreenContext} from "@/features/clients";
import {ClientDetailUpdateWidget, ClientDetailWidget, ClientsListWidget, CreateClientWidget} from "@/widgets/clients";

export default function ClientsScreen() {
	const {activeWidget} = useClientsScreenContext()
	return (
		<div className="h-full w-full flex flex-col gap-4 pb-4">
			{activeWidget === "list" && <ClientsListWidget/>}
			{activeWidget === "detail" && <ClientDetailWidget/>}
			{activeWidget === "update" && <ClientDetailUpdateWidget/>}
			{activeWidget === "create" && <CreateClientWidget/>}
		</div>
	)
}
