"use client";

import { useCartQuery, useClearCart } from "@/features/cart";
import { CartWidget } from "@/widgets/cart/CartWidget";
import Link from "next/link";

export default function CartScreen() {
  const CartQuery = useCartQuery();
  const clearCartMutation = useClearCart();

  // Проверка состояния загрузки
  if (CartQuery.isLoading) {
    return <p>Загрузка Корзины...</p>;
  }

  // Проверка ошибок
  if (CartQuery.isError) {
    return <p>Ошибка при загрузке Корзины</p>;
  }

  const cart: any = CartQuery?.data?.data;

  return (
    <div className="p-4">
      {cart.items && cart.items.length > 0 ? (
        <>
          {/* Кнопка очистки корзины */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => clearCartMutation.mutate()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Очистить корзину
            </button>
          </div>
          <CartWidget data={cart} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 space-y-4">
          <p className="text-xl font-semibold text-gray-700">
            Ваша корзина пуста 😢
          </p>
          <p className="text-gray-500 text-center max-w-xs">
            Добавьте товары в корзину, чтобы увидеть их здесь.
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
