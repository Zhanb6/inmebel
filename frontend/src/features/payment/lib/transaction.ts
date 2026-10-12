import {IFilteredTransaction, ITransaction, TTransactionType} from "@/features/payment/types/payment";

export function convertTransaction(transaction: ITransaction): IFilteredTransaction {
	// Извлекаем дату и время из строки ISO 8601
	const [date, time] = transaction.transaction_datetime.split("T");

	// Время обрабатываем для корректного формата, если оно содержит 'Z' (например, '12:34:56Z')
	const formattedTime = time.split("Z")[0]; // Убираем возможное 'Z' для корректности

	return {
		...transaction, // Сохраняем все остальные поля из ITransaction
		date,           // Используем извлеченную дату
		time: formattedTime, // Используем извлеченное время
	};
}

const transactionType2SignMap: Record<TTransactionType, string> = {
	"PAYMENT": "+",
	"REFUND": "-",
}

export function signedTransactionAmount(amount: number, transactionType: TTransactionType): string {
	const sign = transactionType2SignMap[transactionType] ?? "";
	return `${sign}${amount}`
}