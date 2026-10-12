"use client";

import { IProductDetailData, useLikeProduct } from "@/features/product";
import { Trash2, Heart } from "lucide-react";
import Image from "next/image";

type LikeWidgetProps = {
  data?: IProductDetailData[]; // массив продуктов
};

export function LikeWidget({ data }: LikeWidgetProps) {
  const likeMutation = useLikeProduct();

  if (!data || data.length === 0) return null;

  const handleToggleLike = (productId: number) => {
    likeMutation.mutate(productId);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 mb-20">
      {data.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Изображение товара */}
          <div className="relative w-full h-[209px] rounded-lg overflow-hidden">
            <Image
              src={item.media[0]?.original_url}
              alt={item.name}
              fill
              className=""
            />

            {/* Иконка like */}
            <div
              className="absolute top-2 right-2 p-1 rounded-full cursor-pointer"
              onClick={() => handleToggleLike(item.id)}
            >
              <Heart
                size={20}
                color={item.user_liked ? "red" : "#444"}
                fill={item.user_liked ? "red" : "none"}
              />
            </div>
          </div>

          {/* Название */}
          <p className="mt-3 text-sm font-medium">{item.name}</p>

          {/* Цена */}
          <div className="flex items-end gap-2 mt-1">
            <p className="text-lg font-semibold">
              {item.price.toLocaleString()} тг
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
