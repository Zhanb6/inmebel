"use client";

import { ICart, useDeleteItemCart, useUpdateCart } from "@/features/cart";
import { useCreateOrder } from "@/features/order";
import { Trash2, CreditCard, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type CartWidgetProps = {
  data?: ICart;
};

export function CartWidget({ data }: CartWidgetProps) {
  const updateCartMutation = useUpdateCart();
  const deleteItemMutation = useDeleteItemCart();
  const createOrderMutation = useCreateOrder();

  // Состояния для оплаты
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "idle" | "creating_order" | "processing" | "success" | "error"
  >("idle");
  const [paymentError, setPaymentError] = useState<string>("");
  const [orderId, setOrderId] = useState<number | null>(null);

  if (!data || !data.items) return null;

  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.price_result,
    0,
  );

  const handlePayment = async () => {
    setIsPaying(true);
    setPaymentStep("creating_order");
    setPaymentError("");

    try {
      // 1. Создаем заказ
      const orderResult = await createOrderMutation.mutateAsync();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Ошибка при создании заказа");
      }

      // Предполагаем, что API возвращает ID созданного заказа
      const newOrderId = (orderResult.data as any)?.id || Date.now();

      setOrderId(newOrderId);

      // 2. Симулируем процесс оплаты
      setPaymentStep("processing");

      // Здесь должен быть реальный вызов платежного API
      // Например: await processPayment(newOrderId, totalAmount);

      // Для демонстрации имитируем успешную оплату
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStep("success");
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStep("error");
      setPaymentError(error.message || "Ошибка при обработке платежа");
    } finally {
      setIsPaying(false);
    }
  };

  const resetPayment = () => {
    setPaymentStep("idle");
    setPaymentError("");
    setOrderId(null);
  };

  return (
    <div className="p-4">
      {/* Список товаров */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {data.items.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Изображение товара */}
            <div className="relative w-full h-[209px] rounded-lg overflow-hidden">
              <Image
                src={item.product.media[0]?.original_url}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Название */}
            <p className="mt-3 text-sm font-medium">{item.product.name}</p>

            {/* Цена */}
            <div className="flex items-end gap-2 mt-1">
              <p className="text-lg font-semibold">
                {item.price_result.toLocaleString()} тг
              </p>
            </div>

            {/* Количество */}
            <div className="flex items-center justify-start gap-6 mt-3">
              {item.quantity > 0 ? (
                <button
                  className="w-[30px] h-[30px] rounded-full bg-gray-200 text-xl flex justify-center"
                  onClick={() =>
                    updateCartMutation.mutate({
                      cart_item_id: item.id,
                      quantity: item.quantity - 1,
                    })
                  }
                >
                  –
                </button>
              ) : (
                <button
                  onClick={() => deleteItemMutation.mutate(item.id)}
                  className="p-2 bg-red-100 rounded-full"
                >
                  <Trash2 size={20} strokeWidth={2} />
                </button>
              )}

              <span className="text-lg font-medium">{item.quantity}</span>

              <button
                className="w-[30px] h-[30px] rounded-full bg-green-200 text-xl flex justify-center"
                onClick={() =>
                  updateCartMutation.mutate({
                    cart_item_id: item.id,
                    quantity: item.quantity + 1,
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Блок с общей суммой и кнопкой оплаты */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg mb-9">
        {/* Общая сумма */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Итого:</span>
          <span className="text-xl font-bold text-green-600">
            {totalAmount.toLocaleString()} тг
          </span>
        </div>

        {/* Состояния оплаты */}
        {paymentStep === "idle" && (
          <button
            onClick={handlePayment}
            disabled={data.items.length === 0 || isPaying}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              data.items.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-200 hover:bg-green-700 text-white"
            }`}
          >
            <CreditCard size={20} />
            Перейти к оплате
          </button>
        )}

        {paymentStep === "creating_order" && (
          <div className="text-center py-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Создание заказа...</p>
          </div>
        )}

        {paymentStep === "processing" && (
          <div className="text-center py-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Обработка платежа...</p>
            {orderId && (
              <p className="text-sm text-gray-500 mt-1">Заказ #{orderId}</p>
            )}
          </div>
        )}

        {paymentStep === "success" && (
          <div className="text-center py-3 bg-green-50 rounded-lg border border-green-200">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-700">
              Оплата успешно завершена!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Заказ #{orderId} оплачен на сумму {totalAmount.toLocaleString()}{" "}
              тг
            </p>
            <button
              onClick={resetPayment}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Вернуться к покупкам
            </button>
          </div>
        )}

        {paymentStep === "error" && (
          <div className="text-center py-3 bg-red-50 rounded-lg border border-red-200">
            <p className="font-semibold text-red-700">Ошибка оплаты</p>
            <p className="text-sm text-red-600 mt-1">{paymentError}</p>
            <button
              onClick={resetPayment}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
