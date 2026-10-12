"use client";
import { useTranslation } from "@/i18n";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui";
import { RegisterSelect } from "@/widgets/auth/RegisterSelect";

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useTranslation("screens.auth.AuthScreen");
  return (
    <div
      className="size-full flex flex-col items-center justify-between p-4"
      style={{
        paddingBottom:
          "calc(var(--app-frame-gap) + env(safe-area-inset-bottom))",
      }}
    >
      <RegisterSelect />
    </div>
  );
}
