import {EBankCardType} from "../types";
import {cardType2Image} from "../lib";

export function TransactionCardSkeleton() {
	return (
		<div
			className="w-full p-4 gap-2 grid grid-cols-[1fr_5rem] items-center justify-between bg-card rounded-3xl"
		>
			<span className="text-md font-bold bg-muted h-5 w-4/5 rounded-lg"></span>
			<span className="text-lg font-bold text-end bg-accent h-5 w-full rounded-lg"></span>
			<div className="flex items-center gap-1">
				<img
					src={cardType2Image(EBankCardType.MASTERCARD)}
					alt="Master card"
					className="h-4"
				/>
				<img
					src={cardType2Image(EBankCardType.VISA)}
					alt="Visa"
					className="h-4"
				/>
				<span className="text-sm bg-muted w-20 h-5 rounded-lg"></span>
				<span className="text-sm bg-muted w-14 h-5 rounded-lg"></span>
			</div>
			<span className="text-sm text-end bg-muted h-5 w-full rounded-lg"></span>
		</div>
	)
}