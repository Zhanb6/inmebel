/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client"
import {createContext, useContext} from "react";
import type {INavigationContext} from "../types";

// Create a context with null default to enforce provider usage
export const NavigationContext = createContext<INavigationContext | null>(
	null,
);

// Custom hook for consuming navigation safely
export function useNavigation(): INavigationContext {
	const ctx = useContext(NavigationContext);
	if (!ctx) {
		throw new Error("useNavigation must be used within NavigationProvider");
	}
	return ctx;
}
