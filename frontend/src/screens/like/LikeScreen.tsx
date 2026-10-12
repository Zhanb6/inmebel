"use client";

import { useLikedProductsQuery } from "@/features/product";
import { LikeWidget } from "@/widgets/like/LikeWidget";
import Link from "next/link";

export default function LikeScreen() {
  const likeQuery = useLikedProductsQuery();

  if (likeQuery.isLoading) return <p>Загрузка избранных...</p>;
  if (likeQuery.isError) return <p>Ошибка при загрузке избранного</p>;

  const like: any = likeQuery?.data;

  return (
    <div className="p-4">
      {like?.data.length > 0 ? (
        <LikeWidget data={like.data} />
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 space-y-4">
          <p className="text-xl font-semibold text-gray-700">
            Ваши избранные пустые 😢
          </p>
          <p className="text-gray-500 text-center max-w-xs">
            Добавьте товары в избранное, чтобы увидеть их здесь.
          </p>
          <Link
            href="/product"
            className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition"
          >
            Перейти к товарам
          </Link>
        </div>
      )}
    </div>
  );
}
