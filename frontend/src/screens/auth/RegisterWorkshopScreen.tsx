"use client";

import { RegisterWorkshopWidget } from "@/widgets/auth/RegisterWorkshopWidget";

export default function RegiserWorkshopScreen() {
  return (
    <div className="size-full flex flex-col items-center justify-between">
      <div className="p-4"></div>
      <RegisterWorkshopWidget />
    </div>
  );
}
