import type {IPrice} from "@/shared";

export interface ISubscriptionPlan {
	id: number;                // Уникальный ID тарифа
	name: string;              // Название тарифа (например, "Базовый пакет")
	number_of_lessons: number; // Количество занятий в пакете
	test_price: IPrice;        // Стоимость тестового платежа
	price: IPrice;             // Стоимость пакета
	is_profitable: boolean;    // Выгоден ли тариф
	description?: string;      // Опциональное описание тарифа
	is_active?: boolean;       // Активен ли тариф для выбора учениками
}

export interface IActiveSubscriptionPlan extends ISubscriptionPlan {
	number_of_remaining_lessons: number; // Количество оставшихся занятии
}