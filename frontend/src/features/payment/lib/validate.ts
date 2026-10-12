export const validateCardNumber = (cardNumber: string): boolean => {
	return /^[0-9]{16}$/.test(cardNumber); // Проверка на 16 цифр
}

export const validateExpirationDate = (expirationDate: string): boolean => {
	const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Проверка формата MM/YY
	return regex.test(expirationDate);
}
