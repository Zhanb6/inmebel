/*
 * Copyright (c) 2025. Sayat Raykul
 */

import { z } from "zod";

// Поле email
const emailField = () =>
  z.string({ required_error: "Поле email обязательно" })
    .min(1, "Поле email обязательно")
    .trim()
    .toLowerCase()
    .email("Некорректный email");

// Поле пароль
const passwordField = () =>
  z.string({ required_error: "Поле пароль обязательно" })
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(128, "Пароль должен содержать не более 128 символов")
    // хотя бы одна строчная, одна заглавная, одна цифра
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Пароль должен содержать хотя бы одну строчную букву, одну заглавную и одну цифру"
    );

// Поле OTP (код подтверждения)
const otpField = () =>
  z.string({ required_error: "Введите код подтверждения" })
    .regex(/^\d{4}$/, "Введите 4-значный код");

export const createRegisterSchema = () => {
  return z.object({
    phone: z.string({ required_error: "Поле телефон обязательно" })
      .trim()
      .min(1, "Поле телефон обязательно"),
    name: z.string({ required_error: "Поле имя обязательно" })
      .trim()
      .min(1, "Поле имя обязательно"),
    iin: z.string({ required_error: "Поле ИИН обязательно" })
      .trim()
      .length(12, "ИИН должен содержать 12 символов"),
    address: z.string({ required_error: "Поле адрес обязательно" })
      .trim()
      .min(1, "Поле адрес обязательно"),
    
    // Опциональное, но если заполнено - требует дополнительные поля
    workshop_name: z.string().trim().optional(),
    
    // Опциональные поля мастерской
    workshop_bik: z.string().optional(),
    workshop_bank: z.string().optional(),
    workshop_director_name: z.string().optional(),
    workshop_director_iic: z.string().optional(),
    workshop_bc: z.preprocess(
      (val) => val === "" ? undefined : (isNaN(Number(val)) ? undefined : Number(val)),
      z.number().optional()
    ),
    workshop_city: z.string().optional(),

    password: passwordField(),
    password_confirmation: z.string({ required_error: "Поле пароль обязательно" }),
    
    // Добавьте поле для типа регистрации
    registration_type: z.enum(["client", "workshop"]).optional().default("client"),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: "Пароли не совпадают",
    path: ["password_confirmation"],
  })
  // Если регистрация как мастерская, workshop_name обязательно
  .refine(data => {
    if (data.registration_type === "workshop") {
      return data.workshop_name && data.workshop_name.trim().length > 0;
    }
    return true;
  }, {
    message: "Название мастерской обязательно",
    path: ["workshop_name"],
  });
};


export const createRegisterWorkshopSchema = () => {
  return z
    .object({
      phone: z.string({ required_error: "Поле телефон обязательно" })
        .trim()
        .min(1, "Поле телефон обязательно"),

      name: z.string({ required_error: "Поле имя обязательно" })
        .trim()
        .min(1, "Поле имя обязательно"),

      iin: z.string({ required_error: "Поле ИИН обязательно" })
        .trim()
        .min(12, "Минимальная длина ИИН — 12 символов")
        .max(12, "Максимальная длина ИИН — 12 символов"),

      address: z.string({ required_error: "Поле адрес обязательно" })
        .trim()
        .min(1, "Поле адрес обязательно"),

      workshop_name: z.string().trim().optional(),

      // Новые поля
      workshop_bik: z.string({ required_error: "Поле БИК обязательно" })
        .trim()
        .min(1, "Поле БИК обязательно"),

      workshop_bank: z.string({ required_error: "Поле банк обязательно" })
        .trim()
        .min(1, "Поле банк обязательно"),

      workshop_director_name: z.string({ required_error: "Поле ФИО директора обязательно" })
        .trim()
        .min(1, "Поле ФИО директора обязательно"),

      workshop_director_iic: z.string({ required_error: "Поле ИИК директора обязательно" })
        .trim()
        .min(1, "Поле ИИК директора обязательно"),

      workshop_bc: z.number({ required_error: "Поле БЦ обязательно" })
        .int("Поле БЦ должно быть целым числом")
        .min(10, "БЦ должен состоять из 2 цифр")
        .max(99, "БЦ должен состоять из 2 цифр"),

      workshop_city: z.string({ required_error: "Поле город обязательно" })
        .trim()
        .min(1, "Поле город обязательно"),

      password: passwordField(),
      password_confirmation: z.string({ required_error: "Поле пароль обязательно" }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Пароли не совпадают",
      path: ["password_confirmation"],
    });
};

export const createLoginSchema = () => {
  return z.object({
    phone: z.string({ required_error: "Телефон обязателен" })
      .trim()
      .min(1, "Телефон обязателен"),
    password: passwordField(),
  });
};

export const createChangePasswordSchema = () => {
  return z
    .object({
      oldPassword: passwordField(),
      newPassword: passwordField(),
      confirm: z.string({ required_error: "Поле пароль обязательно" }),
    })
    .refine((data) => data.newPassword === data.confirm, {
      message: "Пароли не совпадают",
      path: ["confirm"],
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: "Новый пароль должен отличаться от старого",
      path: ["newPassword"],
    });
};

export const createResetPasswordSchema = () => {
  return z.object({
    email: emailField(),
  });
};

export const createConfirmResetPasswordSchema = () => {
  return z.object({
    otp: otpField(),
  });
};

export const createSetNewPasswordSchema = () => {
  return z
    .object({
      password: passwordField(),
      confirm: z.string({ required_error: "Поле пароль обязательно" }),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Пароли не совпадают",
      path: ["confirm"],
    });
};
