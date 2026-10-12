import {cn, formatDate} from "@/shared";
import {cardType2Image, shortenCardNumber, signedTransactionAmount} from "../lib";
import type {IFilteredTransaction} from "../types";


export function TransactionCard({item}: { item: IFilteredTransaction }) {
	return (
		<div
			className="w-full min-h-20 h-20 p-4 grid grid-cols-[1fr_4rem] items-center justify-between bg-card rounded-3xl"
		>
			<span className="text-md font-bold">{item.card.cardholder_name}</span>
			<span
				className={cn(
					"text-md font-bold text-end",
					item.transaction_type === "PAYMENT" && "text-accent",
					item.transaction_type === "REFUND" && "text-destructive",
				)}
			>{signedTransactionAmount(item.amount, item.transaction_type)}</span>
			<div className="flex items-center gap-1">
				<img
					src={cardType2Image(item.card.card_type.value)}
					alt={item.card.card_type.label}
					className="h-4"
				/>
				<span className="text-sm">{item.card.card_type.label}</span>
				<span className="text-sm">{shortenCardNumber(item.card.card_number)}</span>
			</div>
			<span className="text-sm text-end">{formatDate(item.transaction_datetime, "dd.MM.yyyy")}</span>
		</div>
	)
}