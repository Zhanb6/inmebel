"use client";

import React, {useState} from "react";

type TActiveWidget =
	| "cabinet"
	| "editStudentDetails"
	| "editParentsQuestionnaire"
	| "Diagnostics"
	| "Blank designer"

interface ICabinetContextType {
	activeWidget: TActiveWidget;
	setActiveWidget: (widget: TActiveWidget) => Promise<void> | void;
}

const CabinetScreenContext = React.createContext<
	ICabinetContextType | undefined
>(undefined);

export const CabinetScreenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [activeWidget, setActiveWidget] = useState<TActiveWidget>("cabinet")

	return (
		<CabinetScreenContext.Provider value={{
			activeWidget,
			setActiveWidget
		}}>
			{children}
		</CabinetScreenContext.Provider>
	);
};

export const useCabinetScreenContext = () => {
	const ctx = React.useContext(CabinetScreenContext);
	if (!ctx) {
		throw new Error(
			"useCabinetScreenContext must be used within a CabinetScreenContext",
		);
	}
	return ctx;
};
