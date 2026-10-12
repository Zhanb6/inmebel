import { useTranslation } from "@/i18n";

export function LogoAndTitleWidget() {
  const { t } = useTranslation("widgets.auth.LogoAndTitleWidget");
  return (
    <div className="flex flex-col items-center justify-center w-full mt-4 p-4 gap-4">
      {/* <img src="/assets/images/logo2.png" alt="logo" /> */}
      {/* <span className="text-center text-primary-foreground">
        {t("Simplify your smart access with our simple login process")}
      </span> */}
    </div>
  );
}
