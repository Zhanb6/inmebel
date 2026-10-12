import { Button } from "@/shared/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterSelect() {
  const router = useRouter();
  const [active, setActive] = useState("Клиент");

  const statuses = [
    {
      name: "Клиент",
      desc: "Exclusive analytics for smart decisions, staying ahead in your workflow",
      link: "/auth/register/client",
    },
    {
      name: "Производитель",
      desc: "Simplify leave requests. Track and approve effortlessly in the app",
      link: "/auth/register/workshop",
    },
    {
      name: "Администратор",
      desc: "From advanced task tracking to complete project management tools",
      link: "/admin",
    },
  ];

  const activeLink = statuses.find((s) => s.name === active)?.link || "#";

  return (
    <div className="size-full rounded-t-2xl flex flex-col items-center justify-between bg-background p-2">
      <div className="size-full flex flex-col gap-2">
        <div className="grid text-left">
          <span className="font-semibold text-[22px]">Регистрация</span>
          <span className="pt-[20px] font-medium text-[14px] text-[#969da6]">
            ВЫБРАТЬ СТАТУС
          </span>
        </div>

        <div className="pt-[14px] grid gap-[14px]">
          {statuses.map((item) => (
            <div
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-[12px] rounded-[10px] px-[16px] py-[12px] bg-white cursor-pointer transition-colors duration-200 
                ${
                  active === item.name
                    ? "border border-[#B7E0C2]"
                    : "border border-[#E6E6E6] hover:border-[#B7E0C2]"
                }`}
            >
              <div className="min-w-[60px] min-h-[60px] bg-[repeating-linear-gradient(135deg,_#FF7E7E_0px,_#FF7E7E_2px,_transparent_2px,_transparent_8px)] rounded-[10px]" />
              <div className="flex-1">
                <p className="font-semibold text-[16px] leading-[20px]">
                  {item.name}
                </p>
                <p className="text-[13px] text-[#969da6] leading-[18px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => router.push(activeLink)}
        className="w-full h-12 bg-button rounded-full"
      >
        Выбрать
      </Button>

      <div className="flex flex-col items-center justify-center">
        <Link href="/auth/login">
          <span className="text-sm">У вас есть аккаунт?</span>
        </Link>
      </div>
    </div>
  );
}
