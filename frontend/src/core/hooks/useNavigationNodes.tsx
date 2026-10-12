/*
 * Copyright (c) 2025. Sayat Raykul
 */
"use client";
import {useTranslation} from "@/i18n";
import {TNavigationNode} from "@/shared/types/navigation";
import CabinetScreen from "@/screens/cabinet/CabinetScreen";
import ClientsScreen from "@/screens/clients/ClientsScreen";
import EventsScreen from "@/screens/events/EventsScreen";
import PaymentScreen from "@/screens/payment/PaymentScreen";
import TariffsScreen from "@/screens/tariffs/TariffsScreen";
import ScheduleScreen from "@/screens/schedule/ScheduleScreen";
import {CalendarSVG, ClientsSVG, PieSVG, StarSVG, UserSVG} from "@/shared/components";
import {CabinetScreenProvider} from "@/features/profile/providers/CabinetScreenProvider";
import {useSession} from "next-auth/react";
import {PaymentScreenProvider, TariffsScreenProvider} from "@/features/payment/providers";
import {ClientsScreenProvider} from "@/features/clients";

export function useNavigationNodes(): TNavigationNode[] {
	const studentNodes = useStudentNavigationNodes()
	const teacherNodes = useTeacherNavigationNodes()
	const {status, data} = useSession();

	if (status === "loading") return []
	if (data?.user.is_superuser) return teacherNodes
	return studentNodes
}

export function useStudentNavigationNodes(): TNavigationNode[] {
	const {t} = useTranslation("core.hooks.useNavigationNodes");
	return [
		{
			key: "schedule",
			type: "tab",
			icon: CalendarSVG,
			title: t("Schedule"),
			body: <ScheduleScreen/>,
		},
		{
			key: "events",
			type: "tab",
			icon: PieSVG,
			title: t("Events"),
			body: <EventsScreen/>,
		},
		{
			key: "payment",
			type: "tab",
			icon: StarSVG,
			title: t("Payment"),
			body: (
				<PaymentScreenProvider>
					<PaymentScreen/>
				</PaymentScreenProvider>
			),
		},
		{
			key: "cabinet",
			type: "tab",
			icon: UserSVG,
			title: t("Cabinet"),
			body: (
				<CabinetScreenProvider>
					<CabinetScreen/>
				</CabinetScreenProvider>
			),
		},
	];
}

export function useTeacherNavigationNodes(): TNavigationNode[] {
	const {t} = useTranslation("core.hooks.useNavigationNodes");
	return [
		{
			key: "schedule",
			type: "tab",
			icon: CalendarSVG,
			title: t("Schedule"),
			body: <ScheduleScreen/>,
		},
		{
			key: "events",
			type: "tab",
			icon: PieSVG,
			title: t("Events"),
			body: <EventsScreen/>,
		},
		{
			key: "tariffs",
			type: "tab",
			icon: StarSVG,
			title: t("Tariffs"),
			body: (
				<TariffsScreenProvider>
					<TariffsScreen/>
				</TariffsScreenProvider>
			),
		},
		{
			key: "clients",
			type: "tab",
			icon: ClientsSVG,
			title: t("Clients"),
			body: (
				<ClientsScreenProvider>
					<ClientsScreen/>
				</ClientsScreenProvider>
			),
		},
		{
			key: "cabinet",
			type: "tab",
			icon: UserSVG,
			title: t("Cabinet"),
			body: (
				<CabinetScreenProvider>
					<CabinetScreen/>
				</CabinetScreenProvider>
			),
		},
	];
}