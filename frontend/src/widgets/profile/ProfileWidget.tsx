"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Phone, Edit2, LogOut, Settings, ChevronRight } from "lucide-react";
import { ProfileResponse } from "@/features/profiles";
import { useLogoutMutation } from "@/features/authentication";
import Link from "next/link";
import { EditProfileModal } from "./edit-modal-workshop";
import { EditClientInfoModal } from "./edit-client-modal";

type ProfileWidgetProps = {
  data?: ProfileResponse;
};

export function ProfileWidget({ data }: ProfileWidgetProps) {
  const logoutMutation = useLogoutMutation();

  if (!data) return null;

  const user = data.user;
  const isWorkshop = data.role === "workshop";

  // Type guards для безопасного доступа к свойствам
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-[402px] mt-6 rounded-[24px] bg-[#fff]">
        <CardContent>
          <div className="flex items-center gap-3.5">
            <div>
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1196_1153)">
                  <rect
                    width="56"
                    height="56"
                    rx="20"
                    fill="#58AB41"
                    fill-opacity="0.1"
                  />
                  <path
                    d="M8 45C8 39.4772 12.4772 35 18 35H38C43.5228 35 48 39.4772 48 45V65C48 70.5228 43.5228 75 38 75H18C12.4772 75 8 70.5228 8 65V45Z"
                    fill="#58AB41"
                  />
                  <circle cx="28" cy="21" r="11" fill="#58AB41" />
                </g>
                <defs>
                  <clipPath id="clip0_1196_1153">
                    <rect width="56" height="56" rx="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="grid">
              <span className="text-[#000] text-[16px] font-medium">
                {user.name}
                {isWorkshop ? <EditProfileModal /> : <EditClientInfoModal />}
              </span>
              <button
                className="text-[#58AB41] text-[14px] font-bold text-left"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Выход..." : "Выйти"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-[402px]  mt-6 rounded-[24px] bg-white">
        <CardContent className="p-0">
          {/* Item 1 */}
          <Link href="/like">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-[18px] text-[#000] font-medium">Избранное</p>
                <p className="text-[14px] text-[#b9b9b9]">64 товара</p>
              </div>

              <span className="text-[#000] text-[18px]">
                <ChevronRight />
              </span>
            </div>
          </Link>

          {/* Divider */}
          <div className="h-[1px] bg-[#E5E5EA] mx-4"></div>

          <Link href="/cart">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-[18px] text-[#000] font-medium">Корзина</p>
                <p className="text-[14px] text-[#b9b9b9]">64 товара</p>
              </div>

              <span className="text-[#000] text-[18px]">
                <ChevronRight />
              </span>
            </div>
          </Link>

          {/* Divider */}
          <div className="h-[1px] bg-[#E5E5EA] mx-4"></div>

          {/* Item 2 */}
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[18px] text-[#000] font-medium">
                Отзывы и вопросы
              </p>
              <p className="text-[14px] text-[#b9b9b9]">
                Делитесь впечетлениями о товаре
              </p>
            </div>

            <span className="text-[#000] text-[18px]">
              <ChevronRight />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-[402px]  mt-6 rounded-[24px] bg-white mb-20">
        <CardContent className="p-0">
          {/* Item 1 */}
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[18px] text-[#000] font-medium">
                Способы оплаты
              </p>
            </div>

            <span className="text-[#000] text-[18px]">
              <ChevronRight />
            </span>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-[#E5E5EA] mx-4"></div>

          {/* Item 2 */}
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[18px] text-[#000] font-medium">
                Связаться с поддержкой
              </p>
            </div>

            <span className="text-[#000] text-[18px]">
              <ChevronRight />
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
