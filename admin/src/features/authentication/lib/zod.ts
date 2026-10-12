import z from "zod";

export const createLoginSchema = () => {
  return z.object({
    phone: z.string()
      .trim()
      .min(1, "Телефон обязателен"),
password: z.any()
  .refine(val => !!val, "Пароль обязателен"),
  });
};