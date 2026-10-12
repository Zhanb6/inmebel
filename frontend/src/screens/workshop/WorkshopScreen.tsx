"use client";

import { WorkshopWidget } from "@/widgets/workshop/WorkshopWidget";

export default function WorkshopScreen() {
  return (
    <div className="min-h-screen bg-white text-[#1B5E20]">
      <div className="items-start px-4">
        <label className="font-semibold text-[22px] text-black mb-6 text-left">
          МОИ ЗАКАЗЫ
        </label>
      </div>
      <WorkshopWidget />
    </div>
  );
}
