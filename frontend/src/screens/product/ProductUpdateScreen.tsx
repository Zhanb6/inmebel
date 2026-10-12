"use client";

import { ProductUpdateWidget } from "@/widgets/product/ProductUpdateWidget";
import { TitleWidget } from "@/widgets/product/TitleWidget";

export default function ProductUpdateScreen() {
  return (
    <div className="size-full flex flex-col justify-between">
      <div className="p-4">
        <div>
          <TitleWidget name="Обновить Продукт" />
        </div>
        <div>
          <ProductUpdateWidget />
        </div>
      </div>
    </div>
  );
}
