"use client";

import { ProductWidget } from "@/widgets/product/ProductWidget";
import { TitleWidget } from "@/widgets/product/TitleWidget";

export default function ProductScreen() {
  return (
    <div className="size-full flex flex-col justify-between">
      <div className="p-4">
        <div>
          <TitleWidget name="Создать Продукт" />
        </div>
        <div>
          <ProductWidget />
        </div>
      </div>
    </div>
  );
}
