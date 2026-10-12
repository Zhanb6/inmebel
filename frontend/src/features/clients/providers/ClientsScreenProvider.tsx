"use client";

import React, {useState} from "react";
import {IProfile} from "@/features/profile";

type TActiveWidget =
	| "list"
	| "detail"
	| "create"
	| "update"

interface IClientScreenContextType {
	activeWidget: TActiveWidget;
	setActiveWidget: (widget: TActiveWidget) => Promise<void> | void;
	selectedClient: IProfile | null;
	setSelectedClient: (profile: IProfile | null) => Promise<void> | void;
}

const ClientsScreenContext = React.createContext<
	IClientScreenContextType | undefined
>(undefined);

export const ClientsScreenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [activeWidget, setActiveWidget] = useState<TActiveWidget>("list")
	const [selectedClient, setSelectedClient] = useState<IProfile | null>(null)

	return (
		<ClientsScreenContext.Provider value={{
			activeWidget,
			setActiveWidget,
			selectedClient,
			setSelectedClient,
		}}>
			{children}
		</ClientsScreenContext.Provider>
	);
};

export const useClientsScreenContext = () => {
	const ctx = React.useContext(ClientsScreenContext);
	if (!ctx) {
		throw new Error(
			"useClientsScreenContext must be used within a ClientsScreenProvider",
		);
	}
	return ctx;
};
