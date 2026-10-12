"use client"
import React, {createContext, useContext, useState} from "react";

type TCurrentWidget = "email" | "otp" | "password" | "success";

interface IFullFormData {
	email: string;
	otp: string;
	newPassword: string;
	confirmPassword: string;
}

// Типы состояния контекста
interface ResetPasswordScreenContextType {
	currentWidget: TCurrentWidget; // Текущий виджет
	formData: IFullFormData; // Данные формы
	setCurrentWidget: (widget: TCurrentWidget) => void; // Функция для смены виджета
	setFormData: (key: keyof IFullFormData, value: string) => void; // Функция для обновления данных формы
}

// Создаем контекст с типом и значениями по умолчанию
const ResetPasswordScreenContext = createContext<ResetPasswordScreenContextType | undefined>(undefined);

// Хук для использования контекста
export const useResetPasswordScreenContext = (): ResetPasswordScreenContextType => {
	const context = useContext(ResetPasswordScreenContext);
	if (!context) {
		throw new Error("useResetPasswordScreenContext must be used within ResetPasswordScreenProvider");
	}
	return context;
};

// Провайдер для управления состоянием виджетов и форм
export const ResetPasswordScreenProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
	// Состояние текущего виджета и данных формы
	const [currentWidget, setCurrentWidget] = useState<TCurrentWidget>("email"); // Начальный виджет
	const [formData, setFormData] = useState<IFullFormData>({
		email: "",
		otp: "",
		newPassword: "",
		confirmPassword: "",
	});

	// Функция для смены текущего виджета
	const updateCurrentWidget = (widget: TCurrentWidget) => setCurrentWidget(widget);

	// Функция для обновления данных формы
	const updateFormData = (key: keyof IFullFormData, value: string) => {
		setFormData((prev) => ({...prev, [key]: value}));
	};

	return (
		<ResetPasswordScreenContext.Provider
			value={{
				currentWidget,
				formData,
				setCurrentWidget: updateCurrentWidget,
				setFormData: updateFormData,
			}}
		>
			{children}
		</ResetPasswordScreenContext.Provider>
	);
};
