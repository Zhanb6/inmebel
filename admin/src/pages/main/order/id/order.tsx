import { useOrderId } from "@/features/order/hooks/useOrders";
import { useOrderNextStatus } from "@/features/order/hooks/useOrders";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  ShoppingCart,
  DollarSign,
  Calendar,
  Clock,
  Hash,
  Building,
  User,
  MapPin,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
  Truck,
  Home,
  Box,
  ArrowRight,
  CreditCard,
  Briefcase,
  Percent,
  Hash as HashIcon,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function OrderId() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useOrderId(Number(id));
  const { mutate: changeStatus, isPending: isChangingStatus } =
    useOrderNextStatus();

  const handleChangeStatus = () => {
    if (order && order.id) {
      changeStatus(order.id);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-center p-8 text-red-500 bg-gray-50 rounded-lg mt-4 border border-gray-200">
        Ошибка загрузки заказа
      </div>
    );

  if (!data)
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50 mt-4 border-gray-200">
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Заказ не найден</h3>
        <p className="text-gray-500">Заказ с ID {id} не существует</p>
      </div>
    );

  const order: any = (data as any).data;
  const products = order.products || [];
  const statuses = order.statuses?.data || [];
  const currentStatus = order.order_status;
  const workshop = order.workshop;
  const nextStatus = order.statuses?.next_status;

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

  // Рассчитываем общее количество товаров и сумму
  const totalQuantity = products.reduce((sum: number, product: any) => {
    return sum + (product.pivot?.quantity || 1);
  }, 0);

  const totalAmount =
    parseFloat(order.price) ||
    products.reduce((sum: number, product: any) => {
      return (
        sum +
        (product.pivot?.price || product.price) * (product.pivot?.quantity || 1)
      );
    }, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Заголовок и кнопка смены статуса */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Назад к заказам
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Заказ #{order.id}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(currentStatus?.id)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(currentStatus?.id)}
                {currentStatus?.name || "Статус не указан"}
              </div>
            </Badge>
            <span className="text-gray-500 text-sm">
              <Calendar className="w-4 h-4 inline mr-1" />
              {new Date(order.created_at).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {totalAmount.toLocaleString("ru-RU")} ₸
            </div>
            <div className="text-sm text-gray-500">
              {totalQuantity} товар{totalQuantity !== 1 ? "а" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Основная информация в 2 колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка: Информация о мастерской */}
        <div className="space-y-6">
          {/* Детальная информация о мастерской */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Информация о мастерской
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="p-2 bg-blue-50 rounded">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {workshop?.name || "Мастерская не указана"}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {workshop?.id}
                    </div>
                  </div>
                </div>

                {workshop?.iin && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-green-50 rounded">
                      <HashIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">ИИН</div>
                      <div className="text-sm text-gray-500">
                        {workshop.iin}
                      </div>
                    </div>
                  </div>
                )}

                {workshop?.director_name && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-purple-50 rounded">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Директор</div>
                      <div className="text-sm text-gray-500">
                        {workshop.director_name}
                      </div>
                    </div>
                  </div>
                )}

                {workshop?.address && (
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-amber-50 rounded mt-1">
                      <MapPin className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Адрес</div>
                      <div className="text-sm text-gray-500">
                        {workshop.address}
                      </div>
                    </div>
                  </div>
                )}

                {workshop?.city && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-emerald-50 rounded">
                      <Home className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Город</div>
                      <div className="text-sm text-gray-500">
                        {workshop.city}
                      </div>
                    </div>
                  </div>
                )}

                {workshop?.bank && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-red-50 rounded">
                      <CreditCard className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Банк</div>
                      <div className="text-sm text-gray-500">
                        {workshop.bank}
                      </div>
                    </div>
                  </div>
                )}

                {workshop?.bic && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">БИК</div>
                      <div className="text-sm text-gray-500">
                        {workshop.bic}
                      </div>
                    </div>
                  </div>
                )}

                {workshop?.iic && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-pink-50 rounded">
                      <Percent className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">ИИК</div>
                      <div className="text-sm text-gray-500">
                        {workshop.iic}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Описание мастерской */}
              {workshop?.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Описание</h3>
                  <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 whitespace-pre-line">
                    {workshop.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Информация о заказе */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Информация о заказе
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">ID заказа:</span>
                  </div>
                  <span className="font-medium text-gray-800">#{order.id}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Общая сумма:</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {totalAmount.toLocaleString("ru-RU")} ₸
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Количество товаров:</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {totalQuantity}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Box className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Уникальных товаров:</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {products.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: Товары и статусы */}
        <div className="space-y-6">
          {/* Товары в заказе */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Товары в заказе ({products.length})
                </h2>
              </div>

              <div className="space-y-4">
                {products.map((product: any) => {
                  const productPrice = product.pivot?.price || product.price;
                  const quantity = product.pivot?.quantity || 1;
                  const subtotal = productPrice * quantity;
                  const productImage = product.media?.[0];

                  return (
                    <div
                      key={product.id}
                      className="p-4 bg-white rounded-lg border border-gray-100"
                    >
                      <div className="flex gap-4">
                        {/* Изображение товара */}
                        {productImage && (
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={productImage.original_url}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Название и цена */}
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-800 truncate">
                                {product.name}
                              </h3>
                              <div className="text-sm text-gray-500 mt-1">
                                {product.description}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {subtotal.toLocaleString("ru-RU")} ₸
                              </div>
                              <div className="text-sm text-gray-500">
                                {productPrice.toLocaleString("ru-RU")} ₸ ×{" "}
                                {quantity}
                              </div>
                            </div>
                          </div>

                          {/* Категории */}
                          {product.categories &&
                            product.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {product.categories.map((category: any) => (
                                  <Badge
                                    key={category.id}
                                    variant="outline"
                                    className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                                  >
                                    {category.name}
                                  </Badge>
                                ))}
                              </div>
                            )}

                          {/* Атрибуты */}
                          {product.attributes &&
                            product.attributes.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {product.attributes.map((attr: any) => (
                                  <div
                                    key={attr.id}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span className="text-gray-600">
                                      {attr.attribute}:
                                    </span>
                                    <span className="font-medium text-gray-800">
                                      {attr.value ||
                                        (attr.variants &&
                                        attr.variants.length > 0
                                          ? attr.variants
                                              .map((v: any) => v.value)
                                              .join(", ")
                                          : "Не указано")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Итоговая сумма */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg font-medium text-gray-800">
                    Итого к оплате:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {totalAmount.toLocaleString("ru-RU")} ₸
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* История статусов */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  История статусов заказа
                </h2>
              </div>

              <div className="space-y-4">
                {statuses.map((status: any, index: number) => {
                  const isPassed = status.passed_at !== null;
                  const isCurrent = status.id === currentStatus?.id;

                  return (
                    <div key={status.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isPassed
                              ? "bg-green-100 text-green-600"
                              : isCurrent
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                        </div>
                        {index < statuses.length - 1 && (
                          <div className="w-0.5 h-6 bg-gray-200 mt-1" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            isPassed
                              ? "text-green-700"
                              : isCurrent
                              ? "text-blue-700"
                              : "text-gray-500"
                          }`}
                        >
                          {status.name}
                        </div>
                        {status.passed_at && (
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(status.passed_at).toLocaleString("ru-RU")}
                          </div>
                        )}
                        {status.comment && (
                          <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                            {status.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Следующий статус */}
              {nextStatus && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ArrowRight className="w-4 h-4" />
                    Следующий статус:
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-800">
                        {nextStatus.name}
                      </span>
                    </div>
                    <Badge
                      variant={nextStatus.can ? "default" : "outline"}
                      className={
                        nextStatus.can
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200"
                      }
                    >
                      {nextStatus.can ? "Доступен" : "Не доступен"}
                    </Badge>
                  </div>

                  {/* Кнопка смены статуса внутри карточки */}

                  <div className="mt-4">
                    <Button
                      onClick={handleChangeStatus}
                      disabled={isChangingStatus}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {isChangingStatus ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Смена статуса...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Откатить
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
