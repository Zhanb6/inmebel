"use client";

import React, {useState} from "react";

type TActiveWidget =
	| "plans"
	| "edit"
	| "create"

interface ITariffsContextType {
	activeWidget: TActiveWidget;
	setActiveWidget: (widget: TActiveWidget) => Promise<void> | void;
}

const TariffsScreenContext = React.createContext<
	ITariffsContextType | undefined
>(undefined);

export const TariffsScreenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [activeWidget, setActiveWidget] = useState<TActiveWidget>("plans")

	return (
		<TariffsScreenContext.Provider value={{
			activeWidget,
			setActiveWidget
		}}>
			{children}
		</TariffsScreenContext.Provider>
	);
};

export const useTariffsScreenContext = () => {
	const ctx = React.useContext(TariffsScreenContext);
	if (!ctx) {
		throw new Error(
			"useTariffsScreenContext must be used within a TariffsScreenContext",
		);
	}
	return ctx;
};
