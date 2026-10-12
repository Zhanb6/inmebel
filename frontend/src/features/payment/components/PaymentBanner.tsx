import {useTranslation} from "@/i18n";
import {cn} from "@/shared";

export function PaymentBanner() {
	const {t} = useTranslation("features.payment.components.PaymentBanner");

	const bannerData = {
		discount: "20%",
		number: 16,
		price_for_8: 250000,
		price_for_16: 400000,
		currency: "KZT",
	}

	return (
		<div
			className={cn(
				"text-primary-foreground w-full px-4 pt-6 pb-8 gap-2 rounded-2xl flex flex-col items-center justify-between",
				"bg-gradient-to-b from-[#3BAF10] from-5% via-accent via-75% to-button to-140%"
			)}
		>
			<span
				className="text-md font-bold text-center">{t("Pay {{discount}} less", {discount: bannerData.discount})}</span>
			<span
				className="text-sm text-center w-3/5">{t("Discount for {{number}} lessons without worries about renewal", {number: bannerData.number})}</span>
			<div className="flex items-center justify-evenly gap-4">
				<div className="flex items-center gap-1">
					<span
						className="text-accent text-md font-bold text-center bg-background rounded-full px-3 py-1">{`${bannerData.price_for_8} ${bannerData.currency}`}</span>
					<span className="text-sm text-center">{t("for {{number}}", {number: 8})}</span>
				</div>
				<div className="flex items-center gap-1">
					<span
						className="text-accent text-md font-bold text-center bg-background rounded-full px-3 py-1">{`${bannerData.price_for_16} ${bannerData.currency}`}</span>
					<span className="text-sm text-center">{t("for {{number}}", {number: 16})}</span>
				</div>
			</div>
		</div>
	)
}