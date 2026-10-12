import {EBankCardType} from "../types";

const cardType2ImageMap: Record<EBankCardType, string> = {
	[EBankCardType.MASTERCARD]: "/assets/images/mastercard.svg",
	[EBankCardType.VISA]: "/assets/images/visa.svg",
}

export function cardType2Image(cardType: EBankCardType): string {
	return cardType2ImageMap[cardType] ?? "";
}

export function shortenCardNumber(cardNumber: string): string {
	return "---- " + cardNumber.slice(12);
}