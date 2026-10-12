"use client";
import { useWorkshopOrdersQuery } from "@/features/order";
import { Skeleton } from "@/shared/components/ui";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Package, DollarSign, Hash, User, ExternalLink } from "lucide-react";
import Link from "next/link";

export function CustomWidget() {
  const { data: ordersResponse, isPending, isError } = useWorkshopOrdersQuery();

  // Loading
  if (isPending)
    return (
      <div className="container mt-12 grid w-full grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-[240px] w-full bg-gray-300" />
            <Skeleton className="h-2 w-1/2 bg-gray-300" />
          </div>
        ))}
      </div>
    );

  // Error
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">
        Ошибка загрузки заказов
      </div>
    );

  // If orders is undefined or empty
  const orders: any[] = ordersResponse?.data || []; // ← Используем any
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-white">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Нет заказов</h3>
        <p className="text-gray-500">Заказы пока не поступали</p>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: any) => {
    const price = parseFloat(order.price) || 0;
    return sum + price;
  }, 0);

  const totalProducts = orders.reduce((sum: number, order: any) => {
    if (!order.products || !Array.isArray(order.products)) return sum;

    return (
      sum +
      order.products.reduce((productSum: number, product: any) => {
        const quantity = product.pivot?.quantity || 0;
        return productSum + quantity;
      }, 0)
    );
  }, 0);

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего заказов</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Hash className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Общая выручка</p>
                <p className="text-2xl font-bold">
                  {totalRevenue.toFixed(2)} ₸
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Товаров продано</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Последние заказы</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order: any, index: number) => {
            const orderPrice = parseFloat(order.price) || 0;
            const totalItems =
              order.products?.reduce(
                (sum: number, product: any) =>
                  sum + (product.pivot?.quantity || 0),
                0,
              ) || 0;

            const isLast = index === orders.length - 1;

            return (
              <Card
                key={order.id}
                className={`hover:shadow-lg transition-all duration-200 bg-white ${
                  isLast ? "mb-20" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Link
                            href={`/custom/${order.id}`}
                            className="hover:underline"
                          >
                            <Badge
                              variant="outline"
                              className="font-mono bg-white hover:bg-gray-50 cursor-pointer"
                            >
                              #{order.id}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Badge>
                          </Link>
                          <Badge
                            className={
                              order.order_status?.id === 1
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                                : "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                            }
                          >
                            {order.order_status?.name || "Неизвестно"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4" />
                          <span className="font-medium">
                            {order.workshop?.name || "Неизвестная мастерская"}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {orderPrice.toFixed(2)} ₸
                        </div>
                        <div className="text-sm text-gray-500">
                          {totalItems} шт.
                        </div>
                      </div>
                    </div>

                    {/* Products Preview */}
                    {order.products && order.products.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Товары ({order.products.length})
                        </div>

                        <div className="space-y-2">
                          {order.products.slice(0, 3).map((product: any) => {
                            const productPrice =
                              parseFloat(product.pivot?.price) || 0;
                            const quantity = product.pivot?.quantity || 0;

                            return (
                              <div
                                key={product.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0 bg-white">
                                    {product.media?.[0]?.original_url ? (
                                      <Image
                                        src={product.media[0].original_url}
                                        alt={product.name || "Товар"}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm line-clamp-1 text-gray-800">
                                      {product.name || "Без названия"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {quantity} × {productPrice.toFixed(2)} ₸
                                    </div>
                                  </div>
                                </div>
                                <div className="font-semibold text-gray-800">
                                  {(quantity * productPrice).toFixed(2)} ₸
                                </div>
                              </div>
                            );
                          })}

                          {order.products.length > 3 && (
                            <div className="text-center text-sm text-gray-500 pt-2">
                              и ещё {order.products.length - 3} товар(ов)
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Footer */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">Заказ #{order.id}</div>
                        <Link
                          href={`/custom/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-sm font-medium"
                        >
                          Подробнее
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
