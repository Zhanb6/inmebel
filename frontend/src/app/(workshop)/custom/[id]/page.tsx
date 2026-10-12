"use client";
import { useState } from "react";
import {
  useWorkshopOrderQuery,
  useNextWorkshopOrderStatus,
} from "@/features/order";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/shared/components/ui";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
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
  Smartphone,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function OrderDetailsPage() {
  const params = useParams() as any;
  const id = params.id as string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: orderResponse,
    isPending,
    isError,
  } = useWorkshopOrderQuery(parseInt(id) as any);
  const {
    mutate: updateStatus,
    isPending: isUpdating,
    isSuccess: isUpdated,
  } = useNextWorkshopOrderStatus(parseInt(id));

  const handleStatusUpdate = () => {
    updateStatus(undefined as any, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  // Loading
  if (isPending)
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Мобильная навигация */}
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-1/3 mb-6 hidden lg:block" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
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
                Ошибка загрузки заказа
              </h2>
              <p className="text-red-600">
                Не удалось загрузить данные заказа #{id}
              </p>
              <Button className="mt-4" variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  // Если заказ не найден
  const order = orderResponse?.data as any;
  if (!order)
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Заказ #{id} не найден
              </h2>
              <p className="text-gray-500">Заказ с таким ID не существует</p>
              <Button className="mt-4" variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  const orderPrice = parseFloat(order.price) || 0;
  const totalItems =
    order.products?.reduce(
      (sum: number, product: any) => sum + (product.pivot?.quantity || 0),
      0,
    ) || 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      {/* Мобильная навигация */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Заказ #{order.id}</h1>
        </div>
        <Badge
          className={
            order.order_status?.id === 1
              ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
              : order.order_status?.id === 6
                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
          }
        >
          {order.order_status?.name || "Неизвестный статус"}
        </Badge>
      </div>

      {/* Header для десктопа */}
      <div className="hidden lg:flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Заказ #{order.id}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              className={
                order.order_status?.id === 1
                  ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
                  : order.order_status?.id === 6
                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                    : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
              }
            >
              {order.order_status?.name || "Неизвестный статус"}
            </Badge>
            <span className="text-sm text-gray-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              {format(
                new Date(order.statuses?.data?.[0]?.passed_at || new Date()),
                "dd MMMM yyyy",
                { locale: ru },
              )}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {orderPrice.toFixed(2)} ₸
          </div>
          <div className="text-sm text-gray-500">{totalItems} товар(ов)</div>
        </div>
      </div>

      {/* Сумма и товары для мобилки */}
      <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {orderPrice.toFixed(2)} ₸
              </div>
              <div className="text-xs text-gray-500 mt-1">Общая сумма</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalItems}
              </div>
              <div className="text-xs text-gray-500 mt-1">Товаров</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация (2/3 ширины) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Информация о товарах */}
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                Товары в заказе
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-4">
                {order.products?.map((product: any) => {
                  const productPrice = parseFloat(product.pivot?.price) || 0;
                  const quantity = product.pivot?.quantity || 0;
                  const totalProductPrice = productPrice * quantity;

                  return (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Изображение товара */}
                        <div className="w-full sm:w-24 h-48 sm:h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                          {product.media?.[0]?.original_url ? (
                            <Image
                              src={product.media[0].original_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 96px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Box className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Информация о товаре */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                {totalProductPrice.toFixed(2)} ₸
                              </div>
                              <div className="text-sm text-gray-500">
                                {quantity} × {productPrice.toFixed(2)} ₸
                              </div>
                            </div>
                          </div>

                          {/* Категории */}
                          {product.categories &&
                            product.categories.length > 0 && (
                              <div className="mt-3">
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  Категории:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {product.categories.map((category: any) => (
                                    <Badge
                                      key={category.id}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {category.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Атрибуты */}
                          {product.attributes &&
                            product.attributes.length > 0 && (
                              <div className="mt-3">
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  Характеристики:
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {product.attributes.map((attr: any) => (
                                    <div key={attr.id} className="text-sm">
                                      <span className="text-gray-600">
                                        {attr.attribute}:
                                      </span>
                                      <span className="font-medium ml-1 block sm:inline">
                                        {attr.value ||
                                          attr.variants?.[0]?.value ||
                                          "—"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* История статусов */}
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="w-5 h-5" />
                История статусов заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-4">
                {order.statuses?.data?.map((status: any, index: number) => {
                  const isPassed = status.passed_at !== null;
                  const isCurrent = status.id === order.order_status?.id;
                  const isNext = status.id === order.statuses?.next_status?.id;

                  return (
                    <div key={status.id} className="flex items-start gap-4">
                      {/* Иконка */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`relative z-10 ${isPassed ? "text-green-500" : "text-gray-300"}`}
                        >
                          {isPassed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Clock className="w-6 h-6" />
                          )}
                        </div>
                        {index < (order.statuses?.data?.length || 0) - 1 && (
                          <div
                            className={`absolute left-3 top-6 w-0.5 h-8 ${
                              isPassed ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>

                      {/* Информация */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                isCurrent
                                  ? "text-blue-600"
                                  : isPassed
                                    ? "text-gray-900"
                                    : "text-gray-500"
                              }`}
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span>{status.name}</span>
                                {isCurrent && (
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                                    Текущий
                                  </Badge>
                                )}
                                {isNext && !isCurrent && (
                                  <Badge variant="outline" className="text-xs">
                                    Следующий
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {status.passed_at && (
                              <div className="text-sm text-gray-500 mt-1">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {format(
                                  new Date(status.passed_at),
                                  "dd MMM yyyy, HH:mm",
                                  { locale: ru },
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель (1/3 ширины) */}
        <div className="space-y-6">
          {/* Информация о мастерской */}
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Мастерская
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Название
                </div>
                <div className="font-medium text-gray-900 truncate">
                  {order.workshop?.name}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">ИИН</div>
                <div className="font-mono text-gray-900">
                  {order.workshop?.iin}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Адрес</div>
                <div className="text-gray-900 flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{order.workshop?.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Сводка заказа */}
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Сводка заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Номер заказа</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус</span>
                  <Badge
                    className={
                      order.order_status?.id === 1
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs"
                        : "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                    }
                  >
                    {order.order_status?.name}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Количество товаров</span>
                  <span className="font-medium">{totalItems} шт.</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span>{orderPrice.toFixed(2)} ₸</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Действия */}
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="w-5 h-5" />
                Действия
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 space-y-3">
              {/* Диалог для изменения статуса */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!order.statuses?.next_status}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {order.statuses?.next_status
                      ? `Перевести в статус: ${order.statuses.next_status.name}`
                      : "Все статусы выполнены"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Подтверждение изменения статуса</DialogTitle>
                    <DialogDescription>
                      {`Вы действительно хотите изменить статус заказа #${order.id} с "${order.order_status?.name}" на "${order.statuses?.next_status?.name}"?`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`p-2 rounded-full ${
                          order.order_status?.id === 1
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Текущий статус</div>
                        <div className="text-sm text-gray-600">
                          {order.order_status?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center my-3">
                      <ChevronLeft className="w-5 h-5 transform rotate-180 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-2 rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Новый статус</div>
                        <div className="text-sm text-gray-600">
                          {order.statuses?.next_status?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating}
                      className="w-full sm:w-auto"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Обновление...
                        </>
                      ) : (
                        "Подтвердить"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Скачать накладную
              </Button>
              <Button variant="outline" className="w-full">
                <Hash className="w-4 h-4 mr-2" />
                Связаться с клиентом
              </Button>
            </CardContent>
          </Card>

          {/* Мобильные кнопки действий */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="container mx-auto">
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="flex-1"
                      size="lg"
                      disabled={!order.statuses?.next_status}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Сменить статус
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Подтверждение изменения статуса</DialogTitle>
                      <DialogDescription>
                        {`Вы действительно хотите изменить статус заказа #${order.id} с "${order.order_status?.name}" на "${order.statuses?.next_status?.name}"?`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`p-2 rounded-full ${
                            order.order_status?.id === 1
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Текущий статус</div>
                          <div className="text-sm text-gray-600">
                            {order.order_status?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center my-3">
                        <ChevronLeft className="w-5 h-5 transform rotate-180 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="p-2 rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Новый статус</div>
                          <div className="text-sm text-gray-600">
                            {order.statuses?.next_status?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={isUpdating}
                        className="w-full sm:w-auto"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Обновление...
                          </>
                        ) : (
                          "Подтвердить"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="flex-1" size="lg">
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
