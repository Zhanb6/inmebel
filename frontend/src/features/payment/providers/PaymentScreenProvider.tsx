"use client";

import React, {useState} from "react";

type TActiveWidget =
	| "main"
	| "plans"
	| "pay"

interface IPaymentContextType {
	activeWidget: TActiveWidget;
	setActiveWidget: (widget: TActiveWidget) => Promise<void> | void;
}

const PaymentScreenContext = React.createContext<
	IPaymentContextType | undefined
>(undefined);

export const PaymentScreenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [activeWidget, setActiveWidget] = useState<TActiveWidget>("main")

	return (
		<PaymentScreenContext.Provider value={{
			activeWidget,
			setActiveWidget
		}}>
			{children}
		</PaymentScreenContext.Provider>
	);
};

export const usePaymentScreenContext = () => {
	const ctx = React.useContext(PaymentScreenContext);
	if (!ctx) {
		throw new Error(
			"usePaymentScreenContext must be used within a PaymentScreenContext",
		);
	}
	return ctx;
};
