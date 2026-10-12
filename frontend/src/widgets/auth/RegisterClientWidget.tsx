"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import {
  Checkbox,
  FloatingLabelPhoneInput,
  LabeledInput,
  LabeledPasswordInput,
  LanguageSelect,
  LoadingSVG,
} from "@/shared/components";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type TLoginSchema,
  TRegisterSchema,
  useLoginMutation,
  useLoginSchema,
  useRegisterMutation,
  useRegisterSchema,
} from "@/features/authentication";
import z from "zod";

// Создаем локальную схему только для клиента
const clientRegisterSchema = z
  .object({
    phone: z.string().min(1, "Телефон обязателен"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    password_confirmation: z
      .string()
      .min(1, "Подтверждение пароля обязательно"),
    name: z.string().min(1, "Имя обязательно"),
    address: z.string().min(1, "Адрес обязателен"),
    iin: z.string().min(1, "ИИН обязателен"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Пароли не совпадают",
    path: ["password_confirmation"],
  });

type TClientRegisterSchema = z.infer<typeof clientRegisterSchema>;

export function RegisterClientWidget() {
  const router = useRouter();
  const { t } = useTranslation("widgets.auth.LoginWidget");
  const schema = useRegisterSchema();

  const registerMutation = useRegisterMutation();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TClientRegisterSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      password: "",
      password_confirmation: "",
      name: "",
      address: "",
      iin: "",
    },
  });

  async function onSubmit(loginData: TClientRegisterSchema) {
    console.log({
      loginData,
    });
    await registerMutation.mutateAsync(
      {
        phone: loginData.phone,
        password: loginData.password,
        password_confirmation: loginData.password_confirmation,
        name: loginData.name,
        address: loginData.address,
        iin: loginData.iin,
      },
      {
        onSuccess: (data) => {
          router.replace("/auth/login");
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        // console.log("Validation errors:", errors);
      })}
      className="size-full rounded-t-2xl flex flex-col items-center justify-between bg-background p-8"
    >
      <div className="size-full flex flex-col items-center gap-2">
        <div className="w-full flex items-center justify-between gap-4">
          <h1 className="w-full text-start text-2xl font-bold">Регистрация</h1>
          {/* <LanguageSelect /> */}
        </div>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <FloatingLabelPhoneInput
              label=""
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.phone?.message}
              className="bg-white"
            />
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <LabeledInput
              name="name"
              label="Имя"
              placeholder="Имя"
              value={field.value}
              onChange={field.onChange}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <LabeledInput
              name="address"
              label="Адрес"
              placeholder="Адрес"
              value={field.value}
              onChange={field.onChange}
              error={errors.address?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="iin"
          render={({ field }) => (
            <LabeledInput
              name="iin"
              label="ИИН"
              placeholder="ИИН"
              value={field.value}
              onChange={field.onChange}
              error={errors.iin?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <LabeledPasswordInput
              name="password"
              label="Пароль"
              placeholder={t("Enter your password")}
              value={field.value}
              onChange={field.onChange}
              error={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field }) => (
            <LabeledPasswordInput
              name="password_confirmation"
              label="Пароль"
              placeholder={t("Enter your password")}
              value={field.value}
              onChange={field.onChange}
              error={errors.password_confirmation?.message}
            />
          )}
        />
        {/* <div className="w-full flex items-center justify-between">
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Checkbox
                label={t("Remember")}
                name="remember"
                checked={field.value === true}
                onCheckedChange={field.onChange}
                error={errors.remember?.message}
              />
            )}
          />
          <Link href="/auth/reset">{t("Forgot password?")}</Link>
        </div> */}
        <Button
          type="submit"
          className="w-full h-12 bg-button rounded-full mt-8"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoadingSVG />}
          <span>Регистрация</span>
        </Button>
      </div>
    </form>
  );
}
