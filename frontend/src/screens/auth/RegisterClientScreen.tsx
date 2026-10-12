"use client";
import { RegisterClientWidget } from "@/widgets/auth/RegisterClientWidget";

export default function RegiserClientScreen() {
  return (
    <div className="size-full flex flex-col items-center justify-between">
      <div className="p-4"></div>

      <RegisterClientWidget />
    </div>
  );
}
