import {useTariffsScreenContext} from "@/features/payment";
import {CreateTariffPackageWidget, EditTariffPackageWidget, TariffPackagesWidget} from "@/widgets/tariffs";
import React from "react";

export default function TariffsScreen() {
	const {activeWidget} = useTariffsScreenContext()
	return (
		<div className="h-full w-full flex flex-col gap-4 pb-4">
			{activeWidget === "plans" && <TariffPackagesWidget/>}
			{activeWidget === "edit" && <EditTariffPackageWidget/>}
			{activeWidget === "create" && <CreateTariffPackageWidget/>}
		</div>
	)
}
