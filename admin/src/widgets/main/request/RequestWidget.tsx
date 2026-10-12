"use client";
import { useRequest } from "@/features/request/hooks/useRequest";
import UsersSkeleton from "@/shared/components/block/users-skeleton";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import Pagination from "@/shared/components/ui/pagination";

import {
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Package,
  Search,
  Hash,
  FileText,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function RequestWidget() {
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

  // Используем хук useRequest с параметрами для пагинации и поиска
  const { data, isLoading, isError } = useRequest({
    page: currentPage,
    perPage: 10,
    search: debouncedSearch,
  });

  if (isLoading) return <UsersSkeleton />;

  if (isError)
    return (
      <div className="text-center p-8 text-red-500 bg-white rounded-lg mt-4 border border-gray-200">
        Ошибка загрузки заявок
      </div>
    );

  const requests: any = (data as any)?.data;
  const meta: any = (data as any)?.meta;

  if (!Array.isArray(requests) || requests.length === 0) {
    return (
      <>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по имени, телефону или ИИН..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center p-8 border rounded-lg bg-white mt-4 border-gray-200">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Нет заявок</h3>
          <p className="text-gray-500">Заявки пока не поступали</p>
        </div>
      </>
    );
  }

  // Рассчитываем статистику
  const totalRequests = meta?.total || requests.length;
  const totalAmount = requests.reduce((sum: number, request: any) => {
    const price = parseFloat(request.price) || 0;
    return sum + price;
  }, 0);

  const uniqueClients = new Set(
    requests.map((request: any) => request.client_iin)
  ).size;

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
                <p className="text-sm text-gray-600">Всего заявок</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalRequests}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm text-gray-600">Уникальных клиентов</p>
                <p className="text-2xl font-bold text-gray-800">
                  {uniqueClients}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Только поиск (без фильтров по статусу) */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по имени, телефону или ИИН..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Сбрасываем на первую страницу при поиске
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список заявок */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Заявки ({totalRequests})
          </h2>
          <div className="text-sm text-gray-500">
            Страница {meta?.current_page || 1} из {meta?.last_page || 1}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request: any) => {
            const requestPrice = parseFloat(request.price) || 0;

            return (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-all duration-200 bg-white border-gray-200 hover:border-gray-300"
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Заголовок заявки */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="font-mono bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                          >
                            <Hash className="w-3 h-3 mr-1" />#{request.id}
                          </Badge>
                          <Badge
                            className={
                              request.request_status?.id === 1
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                                : request.request_status?.id === 2
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
                                : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                            }
                          >
                            {request.request_status?.name || "Неизвестно"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Package className="w-4 h-4" />
                          <span className="font-medium text-gray-700">
                            {request.furniture_type?.name || "Тип не указан"}
                          </span>
                        </div>
                      </div>

                      {/* Цена */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {requestPrice.toLocaleString("ru-RU")} ₸
                        </div>
                        <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.created_at).toLocaleDateString(
                            "ru-RU"
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Информация о клиенте */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded">
                          <User className="w-4 h-4 text-gray-600" />
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

                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-gray-700">
                          {request.client_phone}
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded mt-1">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-gray-700 text-sm">
                          {request.client_address}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded">
                          <Building className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-gray-700">
                          {request.workshop?.name || "Мастерская не указана"}
                        </div>
                      </div>
                    </div>

                    {/* Футер заявки */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-gray-600 p-1.5 bg-white rounded border border-gray-100">
                          <Clock className="w-3 h-3" />
                          {new Date(request.created_at).toLocaleTimeString(
                            "ru-RU",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <button
                          onClick={() =>
                            (window.location.href = `/request/${request.id}`)
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
