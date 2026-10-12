"use client";
import { useOrdersQuery } from "@/features/order";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Package,
  DollarSign,
  User,
  Calendar,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Hash,
  Box,
  Layers,
  FileText,
  ChevronLeft,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "next/image";

export default function OrdersPage() {
  const { data: ordersResponse, isPending, isError } = useOrdersQuery();

  // Loading
  if (isPending)
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Мои заказы
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );

  // Error
  if (isError)
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="w-12 h-12 mx-auto text-red-400 mb-4" />
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Ошибка загрузки заказов
              </h2>
              <p className="text-red-600">
                Не удалось загрузить список заказов
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Повторить попытку
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  const orders = ordersResponse?.data || [];

  // Если нет заказов
  if (orders.length === 0)
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                У вас пока нет заказов
              </h2>
              <p className="text-gray-500 mb-6">
                Сделайте свой первый заказ в каталоге товаров
              </p>
              <Button>Перейти в каталог</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Мои заказы
          </h1>
          <p className="text-gray-600 mt-2">Всего заказов: {orders.length}</p>
        </div>
      </div>

      {/* Фильтры по статусам */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Все
        </Button>
        <Button variant="outline" size="sm">
          <Badge className="mr-2 bg-amber-100 text-amber-800">1</Badge>В
          обработке
        </Button>
        <Button variant="outline" size="sm">
          <Badge className="mr-2 bg-blue-100 text-blue-800">2</Badge>
          Выехал от поставщика
        </Button>
        <Button variant="outline" size="sm">
          <Badge className="mr-2 bg-green-100 text-green-800">0</Badge>
          Доставлен
        </Button>
      </div>

      {/* Список заказов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order: any) => {
          const totalItems =
            order.products?.reduce(
              (sum: number, product: any) =>
                sum + (product.pivot?.quantity || 0),
              0,
            ) || 0;
          const orderPrice = parseFloat(order.price) || 0;

          return (
            <Card
              key={order.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="p-4 lg:p-6">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                  <Badge
                    className={
                      order.order_status?.id === 1
                        ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
                        : order.order_status?.id === 2
                          ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
                          : "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                    }
                  >
                    {order.order_status?.name || "Неизвестный статус"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-4">
                  {/* Информация о мастерской */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 rounded-full bg-gray-100">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {order.workshop?.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {order.workshop?.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Товары */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Товары:
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {order.products
                        ?.slice(0, 3)
                        .map((product: any, index: number) => (
                          <div key={index} className="flex-shrink-0">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                              {product.media?.[0]?.original_url ? (
                                <Image
                                  src={product.media[0].original_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Box className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            {index === 2 && order.products.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                +{order.products.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Статистика */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {totalItems}
                      </div>
                      <div className="text-xs text-gray-500">Товаров</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {orderPrice.toFixed(2)} ₸
                      </div>
                      <div className="text-xs text-gray-500">Сумма</div>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/payment/${order.id}`)
                      }
                    >
                      <FileText className="w-3 h-3 mr-2" />
                      Подробнее
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3"
                      onClick={() =>
                        navigator.clipboard.writeText(order.id.toString())
                      }
                    >
                      <Hash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Сводка */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-500">Всего заказов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {orders
                  .reduce(
                    (sum: number, order: any) =>
                      sum + parseFloat(order.price || 0),
                    0,
                  )
                  .toFixed(2)}{" "}
                ₸
              </div>
              <div className="text-sm text-gray-500">Общая сумма</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {orders.reduce((sum: number, order: any) => {
                  return (
                    sum +
                    (order.products?.reduce(
                      (prodSum: number, product: any) =>
                        prodSum + (product.pivot?.quantity || 0),
                      0,
                    ) || 0)
                  );
                }, 0)}
              </div>
              <div className="text-sm text-gray-500">Всего товаров</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
