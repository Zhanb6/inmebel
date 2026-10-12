"use client";

import { Button } from "@/shared/components/ui";
import { ClientWidget } from "@/widgets/client/ClientWidget";
import { ChevronLeft, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Этап 1 — Тип мебели";
      case 2:
        return "Этап 2 — Конфигурация";
      case 3:
        return "Этап 3 — Контактная информация";
      default:
        return "Конструктор";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex flex-col items-center py-4 space-y-4">
      {/* --- Контейнер: Header --- */}
      <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
        {/* Верхняя панель */}
        <div className="grid grid-cols-[48px_1fr_48px] items-center mb-4">
          <Button
            variant="ghost"
            className="h-[48px] w-[48px] rounded-full flex items-center justify-center bg-[#f1f1f1]"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-10 h-10" />
          </Button>

          <h1 className="font-semibold text-[20px] text-gray-900 text-center">
            Конструктор
          </h1>

          <Button
            variant="ghost"
            className="h-[48px] w-[48px] rounded-full flex items-center justify-center bg-[#f1f1f1]"
          >
            <EllipsisVertical />
          </Button>
        </div>

        {/* Индикатор шагов */}
        <div className="flex items-center gap-2 justify-center">
          <div
            className={`w-[118px] h-[8px] rounded-[24px] ${currentStep >= 1 ? "bg-[#58AB41]" : "bg-[#dfeadc]"}`}
          />
          <div
            className={`w-[118px] h-[8px] rounded-[24px] ${currentStep >= 2 ? "bg-[#58AB41]" : "bg-[#dfeadc]"}`}
          />
          <div
            className={`w-[118px] h-[8px] rounded-[24px] ${currentStep >= 3 ? "bg-[#58AB41]" : "bg-[#dfeadc]"}`}
          />
        </div>

        <span className="block font-medium text-[16px] text-center text-[#979797] mt-2">
          {getStepTitle()}
        </span>
      </div>

      <ClientWidget onStepChange={setCurrentStep} />
    </div>
  );
}
