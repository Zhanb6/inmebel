import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  AlertCircle,
  Users,
  Building,
  UserCheck,
  ShoppingCart,
  Package,
  DollarSign,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useCartQuery } from "@/features/dashboard";

export default function HomeWidget() {
  const CartQuery = useCartQuery();

  if (CartQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (CartQuery.isError) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-700">Ошибка загрузки</h3>
        <p className="text-red-600">
          Не удалось загрузить статистику. Пожалуйста, попробуйте еще раз.
        </p>
      </div>
    );
  }

  const data = CartQuery.data?.data || {};

  // Форматирование чисел с разделителями тысяч
  const formatNumber = (num: string | number) => {
    const numValue = typeof num === "string" ? parseFloat(num) : num;
    return new Intl.NumberFormat("ru-RU").format(numValue);
  };

  // Форматирование суммы денег
  const formatCurrency = (amount: string | number): string => {
    const numValue = typeof amount === "string" ? parseFloat(amount) : amount;

    return new Intl.NumberFormat("ru-KZ", {
      style: "currency",
      currency: "KZT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Пользователи */}
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Пользователи
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.usersCount || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Всего зарегистрировано пользователей
            </p>
          </CardContent>
        </Card>

        {/* Мастерские */}
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Мастерские
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {formatNumber(data.workShopsCount || 0)}
              </span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {formatNumber(data.workShopsAcceptedCount || 0)} подтверждено
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Всего мастерских в системе
            </p>
          </CardContent>
        </Card>

        {/* Клиенты */}
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Клиенты
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.clientsCount || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Активные клиенты</p>
          </CardContent>
        </Card>

        {/* Заявки */}
        <Card className="border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Заявки
            </CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.requestCount || 0)}
            </div>
            <p className="text-xs text-gray-500">
              Общая сумма:{" "}
              <span className="font-semibold">
                {formatCurrency(data.requestPriceSum || 0)}
              </span>
            </p>
            <div className="mt-2 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Выполнено: {formatCurrency(data.requestFinishedPriceSum || 0)}
            </div>
          </CardContent>
        </Card>

        {/* Заказы */}
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Заказы
            </CardTitle>
            <div className="p-2 bg-red-50 rounded-lg">
              <Package className="w-4 h-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.orderCount || 0)}
            </div>
            <p className="text-xs text-gray-500">
              Общая сумма:{" "}
              <span className="font-semibold">
                {formatCurrency(data.orderPriceSum || 0)}
              </span>
            </p>
            <div className="mt-2 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Выполнено: {formatCurrency(data.orderFinishedPriceSum || 0)}
            </div>
          </CardContent>
        </Card>

        {/* Общий доход */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Общий доход
            </CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {formatCurrency(
                parseInt(data.requestPriceSum || 0) +
                  parseInt(data.orderPriceSum || 0)
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Сумма всех заявок и заказов
            </p>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">
                Выполнено:{" "}
                {formatCurrency(
                  parseInt(data.requestFinishedPriceSum || 0) +
                    parseInt(data.orderFinishedPriceSum || 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Статистика заявок */}
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Средняя заявка
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.requestCount > 0
                ? formatCurrency(
                    parseInt(data.requestPriceSum || 0) / data.requestCount
                  )
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Средняя стоимость заявки
            </p>
            <div className="mt-2 text-xs text-blue-600 font-medium">
              Всего заявок: {formatNumber(data.requestCount || 0)}
            </div>
          </CardContent>
        </Card>

        {/* Статистика заказов */}
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Средний заказ
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.orderCount > 0
                ? formatCurrency(
                    parseInt(data.orderPriceSum || 0) / data.orderCount
                  )
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Средняя стоимость заказа
            </p>
            <div className="mt-2 text-xs text-purple-600 font-medium">
              Всего заказов: {formatNumber(data.orderCount || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Сводная информация */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Общая статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">
                Активность системы
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Всего пользователей:
                </span>
                <span className="font-semibold">
                  {formatNumber(data.usersCount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Мастерские/Клиенты:
                </span>
                <span className="font-semibold">
                  {formatNumber(data.workShopsCount || 0)} /{" "}
                  {formatNumber(data.clientsCount || 0)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Финансы</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Общий оборот:</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(
                    parseInt(data.requestPriceSum || 0) +
                      parseInt(data.orderPriceSum || 0)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Выполнено на сумму:
                </span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(
                    parseInt(data.requestFinishedPriceSum || 0) +
                      parseInt(data.orderFinishedPriceSum || 0)
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">
                Эффективность
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Заявок/Заказов:</span>
                <span className="font-semibold">
                  {formatNumber(data.requestCount || 0)} /{" "}
                  {formatNumber(data.orderCount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Конверсия:</span>
                <span className="font-semibold">
                  {data.requestCount > 0
                    ? `${((data.orderCount / data.requestCount) * 100).toFixed(
                        1
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
