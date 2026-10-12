import {z} from "zod";
import {TFunction} from "@/i18n";

export const createCreateSubscriptionPlanSchema = (
	t: TFunction<"features.payment.lib.zod">,
) => {
	return z.object({
		// 🟢 ИСПОЛЬЗУЙТЕ z.coerce.number() для преобразования строки в число
		numberOfLessons: z.coerce.number({
			required_error: t("Number of lessons is required")
		})
		// 🟣 Добавьте проверку, что число больше 0, если это логически необходимо
		.positive(t("Number of lessons must be positive")),

		price: z.coerce.number({
			required_error: t("Price is required")
		})
		.positive(t("Price must be positive")),

		testPrice: z.coerce.number({
			required_error: t("Test price is required")
		})
		// Если цена может быть 0, используйте .nonnegative()
		.nonnegative(t("Test price cannot be negative")),
	});
};