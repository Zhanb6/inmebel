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
  useRegisterMutation,
  TRegisterSchema,
  useRegisterSchema,
} from "@/features/authentication";
import {
  TRegisterWorkshopSchema,
  useRegisterWorkshopSchema,
} from "@/features/authentication/lib/zodClient";

export function RegisterWorkshopWidget() {
  const router = useRouter();
  const { t } = useTranslation("widgets.auth.LoginWidget");
  const schema = useRegisterWorkshopSchema();
  const registerMutation = useRegisterMutation();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TRegisterWorkshopSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      password: "",
      password_confirmation: "",
      name: "",
      address: "",
      iin: "",
      workshop_name: "",
    },
  });

  async function onSubmit(loginData: TRegisterWorkshopSchema) {
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
        workshop_name: loginData.workshop_name,

        // Новые поля
        workshop_bik: loginData.workshop_bik,
        workshop_bank: loginData.workshop_bank,
        workshop_director_name: loginData.workshop_director_name,
        workshop_director_iic: loginData.workshop_director_iic,
        workshop_bc: loginData.workshop_bc,
        workshop_city: loginData.workshop_city,
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
          <h1 className="w-full text-start text-2xl font-bold">
            Регистрация Цеха
          </h1>
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
          name="workshop_name"
          render={({ field }) => (
            <LabeledInput
              name="workshop_name"
              label="Имя Цеха"
              placeholder="Имя Цеха"
              value={field.value}
              onChange={field.onChange}
              error={errors.workshop_name?.message}
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

        {/* Новые поля */}
        <Controller
          control={control}
          name="workshop_bik"
          render={({ field }) => (
            <LabeledInput
              name="workshop_bik"
              label="БИК"
              placeholder="БИК"
              value={field.value}
              onChange={field.onChange}
              error={errors.workshop_bik?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="workshop_bank"
          render={({ field }) => (
            <LabeledInput
              name="workshop_bank"
              label="Банк"
              placeholder="Банк"
              value={field.value}
              onChange={field.onChange}
              error={errors.workshop_bank?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="workshop_director_name"
          render={({ field }) => (
            <LabeledInput
              name="workshop_director_name"
              label="ФИО директора"
              placeholder="ФИО директора"
              value={field.value}
              onChange={field.onChange}
              error={errors.workshop_director_name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="workshop_director_iic"
          render={({ field }) => (
            <LabeledInput
              name="workshop_director_iic"
              label="ИИК директора"
              placeholder="ИИК директора"
              value={field.value}
              onChange={field.onChange}
              error={errors.workshop_director_iic?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="workshop_bc"
          render={({ field }) => (
            <LabeledInput
              name="workshop_bc"
              type="number"
              label="БЦ"
              placeholder="БЦ (2 цифры)"
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={errors.workshop_bc?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="workshop_city"
          render={({ field }) => (
            <LabeledInput
              name="workshop_city"
              label="Город"
              placeholder="Город"
              value={field.value}
              onChange={field.onChange}
              error={errors.workshop_city?.message}
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
