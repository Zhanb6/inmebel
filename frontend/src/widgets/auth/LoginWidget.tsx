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
  useLoginMutation,
  useLoginSchema,
} from "@/features/authentication";

export function LoginWidget() {
  const router = useRouter();
  const { t } = useTranslation("widgets.auth.LoginWidget");
  const schema = useLoginSchema();
  const loginMutation = useLoginMutation();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      password: "",
      // remember: false,
    },
  });

  async function onSubmit(loginData: TLoginSchema) {
    console.log({
      loginData,
    });
    await loginMutation.mutateAsync(
      {
        phone: loginData.phone,
        password: loginData.password,
        // remember: loginData.remember,
      },
      {
        onSuccess: (data) => {
          router.replace("/");
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
          <h1 className="w-full text-start text-2xl font-bold">{t("Login")}</h1>
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
          <span>{t("Log in")}</span>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Link href="/auth">
          <span className="text-sm">{t("Don't have an account?")}</span>
        </Link>
        <Link href="#" className="text-md font-bold">
          {t("Contact a specialist")}
        </Link>
      </div>
    </form>
  );
}
