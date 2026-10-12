"use client";

import { useOrders } from "@/features/order/hooks/useOrders";
import UsersSkeleton from "@/shared/components/block/users-skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import Pagination from "@/shared/components/ui/pagination";

import {
  Package,
  DollarSign,
  Building,
  Calendar,
  Clock,
  Hash,
  Search,
  User,
  Phone,
  MapPin,
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Order() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Добавляем debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Используем хук useOrders с параметрами для пагинации и поиска
  const { data, isLoading, isError } = useOrders({
    page: currentPage,
    perPage: 10,
    search: debouncedSearch,
  });

  if (isLoading) return <UsersSkeleton />;

  if (isError)
    return (
      <div className="text-center p-8 text-red-500 bg-white rounded-lg mt-4 border border-gray-200">
        Ошибка загрузки заказов
      </div>
    );

  // Если data.data не определен или пуст
  const orders: any = data || [];
  const meta: any = (data as any)?.meta;

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по мастерской, статусу или ID..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center p-8 border rounded-lg bg-white mt-4 border-gray-200">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Нет заказов</h3>
          <p className="text-gray-500">Заказы пока не созданы</p>
        </div>
      </>
    );
  }

  // Рассчитываем статистику
  const totalOrders = meta?.total || orders.length;
  const totalAmount = orders.reduce((sum: number, order: any) => {
    const price = parseFloat(order.price) || 0;
    return sum + price;
  }, 0);

  const uniqueWorkshops = new Set(
    orders.map((order: any) => order.workshop?.id)
  ).size;

  // Функция для получения иконки статуса
  const getStatusIcon = (statusId: number) => {
    switch (statusId) {
      case 1: // В обработке
        return <AlertCircle className="w-4 h-4" />;
      case 2: // Завершен
        return <CheckCircle className="w-4 h-4" />;
      case 3: // Отменен
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Функция для получения цвета статуса
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: // В обработке
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
      case 2: // Завершен
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200";
      case 3: // Отменен
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4 rounded-lg mt-4">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего заказов</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalOrders}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общая сумма</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalAmount.toLocaleString("ru-RU")} ₸
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Уникальных мастерских</p>
                <p className="text-2xl font-bold text-gray-800">
                  {uniqueWorkshops}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по мастерской, статусу или ID..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список заказов */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Заказы ({totalOrders})
          </h2>
          <div className="text-sm text-gray-500">
            Страница {meta?.current_page || 1} из {meta?.last_page || 1}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order: any) => {
            const orderPrice = parseFloat(order.price) || 0;
            const productsCount = order.products?.length || 0;

            return (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-all duration-200 bg-white border-gray-200 hover:border-gray-300"
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Заголовок заказа */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="font-mono bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                          >
                            <Hash className="w-3 h-3 mr-1" />#{order.id}
                          </Badge>
                          <Badge
                            className={getStatusColor(order.order_status?.id)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.order_status?.id)}
                              {order.order_status?.name || "Статус не указан"}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Package className="w-4 h-4" />
                          <span className="font-medium text-gray-700">
                            {productsCount} товар
                            {productsCount !== 1 ? "а" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Цена */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {orderPrice.toLocaleString("ru-RU")} ₸
                        </div>
                        <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date().toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                    </div>

                    {/* Информация о мастерской */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded">
                          <Building className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 truncate">
                            {order.workshop?.name || "Мастерская не указана"}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            ИИН: {order.workshop?.iin || "Не указан"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded mt-1">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-gray-700 text-sm">
                          Директор:{" "}
                          {order.workshop?.director_name || "Не указан"}
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded mt-1">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-gray-700 text-sm">
                          {order.workshop?.address || "Адрес не указан"}
                        </div>
                      </div>

                      {order.workshop?.phone && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                          <div className="p-1.5 bg-gray-100 rounded">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="text-gray-700">
                            {order.workshop.phone}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Список товаров */}
                    {order.products && order.products.length > 0 && (
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Товары в заказе:
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {order.products.map((product: any) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 text-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-800 truncate">
                                  {product.name}
                                </div>
                                <div className="text-gray-500">
                                  {product.pivot?.quantity || 1} ×{" "}
                                  {product.pivot?.price || product.price} ₸
                                </div>
                              </div>
                              <div className="text-gray-700 font-medium ml-2">
                                {(
                                  (product.pivot?.quantity || 1) *
                                  (product.pivot?.price || product.price)
                                ).toLocaleString("ru-RU")}{" "}
                                ₸
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Футер заказа */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-gray-600 p-1.5 bg-white rounded border border-gray-100">
                          <Clock className="w-3 h-3" />
                          {new Date().toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <button
                          onClick={() =>
                            (window.location.href = `/order/${order.id}`)
                          }
                          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-white transition-colors"
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Пагинация */}
        {meta && meta.last_page > 1 && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            total={meta.total}
            from={meta.from}
            to={meta.to}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
