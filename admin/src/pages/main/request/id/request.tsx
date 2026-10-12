import { useRequestId } from "@/features/request/hooks/useRequest";
import { useRequestNextStatus } from "@/features/request/hooks/useRequest";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Building,
  Package,
  Hash,
  FileText,
  Clock,
  CheckCircle,
  Ruler,
  Palette,
  Layers,
  Box,
  Type,
  CheckSquare,
  Square,
  ArrowRight,
  Image as ImageIcon,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function RequestId() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useRequestId(Number(id));
  const { mutate: changeStatus, isPending: isChangingStatus } =
    useRequestNextStatus();

  const handleChangeStatus = () => {
    if (request && request.id) {
      changeStatus(request.id);
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
        Ошибка загрузки заявки
      </div>
    );

  if (!data)
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50 mt-4 border-gray-200">
        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">
          Заявка не найдена
        </h3>
        <p className="text-gray-500">Заявка с ID {id} не существует</p>
      </div>
    );

  const request: any = (data as any).data;
  const furnitureData = request.furniture_data;
  const statuses = request.statuses?.data || [];
  const currentStatus = request.request_status;
  const nextStatus = request.statuses?.next_status;

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
              Назад к заявкам
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Заявка #{request.id}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              className={
                currentStatus?.id === 1
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                  : currentStatus?.id === 2
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
              }
            >
              {currentStatus?.name || "Неизвестно"}
            </Badge>
            <span className="text-gray-500 text-sm">
              <Calendar className="w-4 h-4 inline mr-1" />
              {new Date(request.created_at).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {parseFloat(
                request.price || request.price_from || "0"
              ).toLocaleString("ru-RU")}{" "}
              ₸
            </div>
            {request.price_to && (
              <div className="text-sm text-gray-500">
                до {parseFloat(request.price_to).toLocaleString("ru-RU")} ₸
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Основная информация в 2 колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка: Информация о клиенте и мастерской */}
        <div className="space-y-6">
          {/* Информация о клиенте */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Информация о клиенте
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="p-2 bg-blue-50 rounded">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {request.client_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ИИН: {request.client_iin}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="p-2 bg-green-50 rounded">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <a
                    href={`tel:${request.client_phone}`}
                    className="font-medium text-gray-800 hover:text-blue-600"
                  >
                    {request.client_phone}
                  </a>
                </div>

                {request.client_address && (
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-purple-50 rounded mt-1">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="font-medium text-gray-800">
                      {request.client_address}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Информация о мастерской */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Мастерская
                </h2>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-amber-50 rounded">
                  <Building className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {request.workshop?.name || "Мастерская не указана"}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {request.workshop_id}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Информация о типе мебели */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Тип мебели
                </h2>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-emerald-50 rounded">
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-medium text-gray-800">
                  {request.furniture_type?.name || "Тип не указан"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: Детали мебели и статусы */}
        <div className="space-y-6">
          {/* Детали мебели */}
          {furnitureData && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Box className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Детали мебели
                  </h2>
                </div>

                <div className="space-y-3">
                  {furnitureData.type && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Type className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Тип кухни:</span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {furnitureData.type.name}
                      </span>
                    </div>
                  )}

                  {furnitureData.frame && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Каркас:</span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {furnitureData.frame.name}
                      </span>
                    </div>
                  )}

                  {furnitureData.facade && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Фасад:</span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {furnitureData.facade.name}
                      </span>
                    </div>
                  )}

                  {furnitureData.facade_type && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Тип фасада:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {furnitureData.facade_type.name}
                        </span>
                        {furnitureData.facade_type.media && (
                          <div className="w-8 h-8 relative rounded overflow-hidden">
                            <img
                              src={furnitureData.facade_type.media.original_url}
                              alt={furnitureData.facade_type.name}
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {furnitureData.facade_color && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Palette className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Цвет фасада:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {furnitureData.facade_color.name}
                        </span>
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: furnitureData.facade_color.code,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {furnitureData.brand && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Бренд:</span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {furnitureData.brand.name}
                      </span>
                    </div>
                  )}

                  {furnitureData.length && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Ruler className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Длина:</span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {furnitureData.length} см
                      </span>
                    </div>
                  )}
                </div>

                {/* Дополнения */}
                {furnitureData.addons && furnitureData.addons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Дополнения:
                    </h3>
                    <div className="space-y-2">
                      {furnitureData.addons.map((addon: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">{addon.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Наполнение */}
                {furnitureData.filling && furnitureData.filling.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Наполнение:
                    </h3>
                    <div className="space-y-2">
                      {furnitureData.filling.map((fill: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Square className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700">{fill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* История статусов */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  История статусов
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
                    <span className="font-medium text-gray-800">
                      {nextStatus.name}
                    </span>
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
