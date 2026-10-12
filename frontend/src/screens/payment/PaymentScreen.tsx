import {ActiveSubscriptionWidget, PayWidget, TariffPackagesWidget} from "@/widgets/payment";
import {usePaymentScreenContext} from "@/features/payment";
import React from "react";

export default function PaymentsScreen() {
	const {activeWidget} = usePaymentScreenContext()
	return (
		<div className="h-full w-full flex flex-col gap-4 pb-4">
			{activeWidget === "main" && <ActiveSubscriptionWidget/>}
			{activeWidget === "plans" && <TariffPackagesWidget/>}
			{activeWidget === "pay" && <PayWidget/>}
		</div>
	)
}
