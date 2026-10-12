export interface IPrice {
	cost: number;
	currency: string;
	currencyPosition: "start" | "end";
}

export function price2String(price: IPrice): string {
	const {cost, currency, currencyPosition} = price;

	const formattedCost = cost.toLocaleString();

	if (currencyPosition === "start") {
		return `${currency}${formattedCost}`;
	} else {
		return `${formattedCost}${currency}`;
	}
}
