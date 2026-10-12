import { max } from "date-fns";
import z from "zod";

export const createProductSchema = () => {
  return z.object({
    name: z
      .string({ required_error: "Название обязательно" })
      .trim()
      .min(1, "Название обязательно"),

    description: z
      .string({ required_error: "Описание обязательно" })
      .trim()
      .min(1, "Описание обязательно"),

    price: z
      .string({ required_error: "Цена обязательна" })
      .trim()
      .min(1, "Цена обязательна"),

    images: z
      .any()
      .refine((files) => files && files.length > 0, {
        message: "Добавьте хотя бы одно изображение",
      }),

    categories: z
      .array(z.number())
      .min(1, "Добавьте хотя бы одну категорию"),

attributes: z
  .array(
    z.object({
      id: z.number({ required_error: "ID атрибута обязателен" }),
      value: z.string().optional(),
      attribute_variant_ids: z.array(z.number()).optional(),
    })
  )
  .min(1, "Добавьте хотя бы один атрибут")
  .optional(),

  });
};


export const starProductSchema = () => {
  return z.object({
    star: z
      .string({ required_error: "Оценка обязательная" })
      .min(1, "Минимальное количество звезд 1")
      .max(5, "Максимальное количество звезд 5"),

    comment: z
      .string({ required_error: "Комментарий обязателен" })
      .trim()
      .min(1, "Комментарий обязателен"),
  });
};
