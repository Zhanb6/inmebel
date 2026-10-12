import type {IProfile} from "@/features/profile";

export enum EBankCardType {
	VISA = "VISA",
	MASTERCARD = "MASTERCARD",
}

export interface IBankCardType {
	id: number;
	label: string;
	value: EBankCardType;
}

export interface IBankCard {
	user: IProfile;                 // ID пользователя, который владеет картой
	card_number: string;            // Номер карты (например, 16 цифр)
	cardholder_name: string;        // Имя владельца карты
	expiration_date: string;        // Дата истечения срока действия карты (формат YYYY-MM-DD)
	cvv: string;                    // CVV код карты
	card_type: IBankCardType;       // Тип карты (например, VISA, MasterCard)
	is_active: boolean;             // Статус карты (активна или нет)
}

export type TTransactionType = 'PAYMENT' | 'REFUND';
export type TTransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface ITransaction {
	id: string;                         // Уникальный ID транзакции
	amount: number;                     // Сумма транзакции
	transaction_datetime: string;       // Дата и время транзакции (формат ISO 8601)
	transaction_type: TTransactionType; // Тип транзакции
	status: TTransactionStatus;         // Статус транзакции
	card: IBankCard;                    // Ссылка на банковскую карту (ID карты)
	merchant_name?: string;             // Название продавца или магазина (необязательное)
	description?: string;               // Описание транзакции (необязательное)
	reference_number?: string;          // Ссылка на внешний идентификатор транзакции (например, номер заказа, необязательное)
}

export interface IFilteredTransaction extends ITransaction {
	date: string; // Дата транзакции yyyy-MM-dd
	time: string; // Время транзакции HH-mm-ss
}
