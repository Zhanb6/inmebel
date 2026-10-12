"use client";

import { useUsers } from "@/features/user/hooks/useUser";
import { useUserAcceptWorkshop } from "@/features/user/hooks/useUser";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import Pagination from "@/shared/components/ui/pagination";
import {
  Phone,
  MapPin,
  Building,
  Calendar,
  Hash,
  Search,
  Shield,
  ShoppingBag,
  UserCircle,
  Mail,
  IdCard,
  User,
  CheckCircle,
  Loader2,
  CheckSquare,
  Clock,
  Filter,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import UsersSkeleton from "@/shared/components/block/users-skeleton";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [acceptedFilter, setAcceptedFilter] = useState<string>("all");
  const { mutate: acceptWorkshop, isPending: isAccepting } =
    useUserAcceptWorkshop();

  // Добавляем debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Подготавливаем параметры запроса
  const queryParams: any = {
    page: currentPage,
    perPage: 10,
    search: debouncedSearch,
  };

  // Добавляем фильтр по роли
  if (roleFilter !== "all") {
    queryParams.role = roleFilter;
  }

  // Добавляем фильтр по подтверждению мастерских
  if (acceptedFilter !== "all") {
    queryParams.workshop_accepted = acceptedFilter === "accepted" ? 1 : 0;
  }

  // Используем хук useUsers с параметрами для пагинации, поиска и фильтров
  const { data, isLoading, isError } = useUsers(queryParams);

  const handleAcceptWorkshop = (userId: number) => {
    acceptWorkshop(userId, {
      onSuccess: () => {
        // Данные автоматически обновятся благодаря invalidateQueries
      },
      onError: (error) => {
        console.error("Ошибка подтверждения мастерской:", error);
      },
    });
  };

  const handleClearFilters = () => {
    setRoleFilter("all");
    setAcceptedFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Проверяем активные фильтры
  const hasActiveFilters =
    roleFilter !== "all" || acceptedFilter !== "all" || searchTerm;

  if (isLoading) return <UsersSkeleton />;

  if (isError)
    return (
      <div className="text-center p-8 text-red-500 bg-white rounded-lg mt-4 border border-gray-200">
        Ошибка загрузки пользователей
      </div>
    );

  const users = data?.data || [];
  const meta: any = (data as any)?.meta;

  if (!Array.isArray(users) || users.length === 0) {
    return (
      <>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по имени, телефону или роли..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Очистить фильтры
                </Button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Все роли" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="admin">Администраторы</SelectItem>
                  <SelectItem value="workshop">Мастерские</SelectItem>
                  <SelectItem value="client">Клиенты</SelectItem>
                </SelectContent>
              </Select>

              <Select value={acceptedFilter} onValueChange={setAcceptedFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Статус мастерской" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="accepted">Подтвержденные</SelectItem>
                  <SelectItem value="pending">
                    Ожидающие подтверждения
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <div className="text-center p-8 border rounded-lg bg-white mt-4 border-gray-200">
          <UserCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            Нет пользователей
          </h3>
          <p className="text-gray-500">
            {hasActiveFilters
              ? "Пользователи по заданным фильтрам не найдены"
              : "Пользователи пока не зарегистрированы"}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="mt-4"
            >
              <X className="w-4 h-4 mr-2" />
              Очистить фильтры
            </Button>
          )}
        </div>
      </>
    );
  }

  // Рассчитываем статистику
  const totalUsers = meta?.total || users.length;
  const adminCount = users.filter((user) => user.role === "admin").length;
  const workshopCount = users.filter((user) => user.role === "workshop").length;
  const clientCount = users.filter((user) => user.role === "client").length;

  // Статистика по мастерским
  const acceptedWorkshops = users.filter(
    (user) => user.role === "workshop" && user.workshop_data?.accepted
  ).length;
  const pendingWorkshops = users.filter(
    (user) => user.role === "workshop" && !user.workshop_data?.accepted
  ).length;

  // Функция для получения цвета роли
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
      case "workshop":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
      case "client":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
    }
  };

  // Функция для получения иконки роли
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "workshop":
        return <Building className="w-4 h-4" />;
      case "client":
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return <UserCircle className="w-4 h-4" />;
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4 rounded-lg mt-4">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего пользователей</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <User />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Администраторы</p>
                <p className="text-2xl font-bold text-gray-800">{adminCount}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Мастерские</p>
                <p className="text-2xl font-bold text-gray-800">
                  {workshopCount}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {pendingWorkshops} подтверждено
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {acceptedWorkshops} ожидают
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Клиенты</p>
                <p className="text-2xl font-bold text-gray-800">
                  {clientCount}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск и фильтры */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по имени, телефону или роли..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Очистить фильтры
              </Button>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Все роли" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="admin">Администраторы</SelectItem>
                <SelectItem value="workshop">Мастерские</SelectItem>
                <SelectItem value="client">Клиенты</SelectItem>
              </SelectContent>
            </Select>

            <Select value={acceptedFilter} onValueChange={setAcceptedFilter}>
              <SelectTrigger className="w-full md:w-48">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Статус мастерской" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="accepted">Подтвержденные</SelectItem>
                <SelectItem value="pending">Ожидающие подтверждения</SelectItem>
              </SelectContent>
            </Select>

            {/* Индикатор активных фильтров */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <Filter className="w-4 h-4" />
                <span>Активные фильтры:</span>
                {roleFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Роль:{" "}
                    {roleFilter === "admin"
                      ? "Администратор"
                      : roleFilter === "workshop"
                      ? "Мастерская"
                      : "Клиент"}
                  </Badge>
                )}
                {acceptedFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {acceptedFilter === "accepted"
                      ? "Подтвержденные"
                      : "Ожидающие"}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Поиск: {searchTerm}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Список пользователей */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Пользователи ({totalUsers})
            </h2>
            {hasActiveFilters && (
              <p className="text-sm text-gray-500 mt-1">
                Отфильтровано по вашим критериям
              </p>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Страница {meta?.current_page || 1} из {meta?.last_page || 1}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user: any) => {
            const isWorkshop = user.role === "workshop";
            const isClient = user.role === "client";
            const workshopAccepted =
              isWorkshop && user.workshop_data?.accepted_at;

            return (
              <Card
                key={user.id}
                className={`hover:shadow-lg transition-all duration-200 bg-white border-gray-200 hover:border-gray-300 ${
                  isWorkshop && !workshopAccepted ? "" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Заголовок пользователя */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="font-mono bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                          >
                            <Hash className="w-3 h-3 mr-1" />#{user.id}
                          </Badge>
                          <Badge className={getRoleColor(user.role)}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {user.role === "admin" && "Администратор"}
                              {user.role === "workshop" && "Мастерская"}
                              {user.role === "client" && "Клиент"}
                            </div>
                          </Badge>
                          {isWorkshop && (
                            <Badge
                              className={
                                workshopAccepted
                                  ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
                              }
                            >
                              {workshopAccepted ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Подтверждена
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Ожидает подтверждения
                                </>
                              )}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Phone className="w-4 h-4" />
                          <span className="font-medium text-gray-700">
                            {user.phone}
                          </span>
                        </div>
                      </div>

                      {/* Аватар */}
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>

                    {/* Информация о пользователе */}
                    <div className="space-y-3">
                      {/* ИИН */}
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-gray-100 rounded">
                          <IdCard className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700">
                            ИИН
                          </div>
                          <div className="text-gray-900">
                            {isWorkshop
                              ? user.workshop_data?.iin
                              : isClient
                              ? user.client_data?.iin
                              : "Не указан"}
                          </div>
                        </div>
                      </div>

                      {/* Адрес */}
                      {(isWorkshop || isClient) && (
                        <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100">
                          <div className="p-1.5 bg-gray-100 rounded mt-1">
                            <MapPin className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="text-gray-700 text-sm">
                            {isWorkshop
                              ? user.workshop_data?.address
                              : isClient
                              ? user.client_data?.address
                              : "Адрес не указан"}
                          </div>
                        </div>
                      )}

                      {/* Для мастерской - дополнительная информация */}
                      {isWorkshop && user.workshop_data && (
                        <>
                          <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100">
                            <div className="p-1.5 bg-gray-100 rounded mt-1">
                              <Building className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="text-gray-700 text-sm">
                              <div className="font-medium">
                                {user.workshop_data.name}
                              </div>
                              <div>
                                Директор: {user.workshop_data.director_name}
                              </div>
                              {user.workshop_data.city && (
                                <div>Город: {user.workshop_data.city}</div>
                              )}
                            </div>
                          </div>

                          {user.workshop_data.bank && (
                            <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gray-100">
                              <div className="p-1.5 bg-gray-100 rounded mt-1">
                                <Mail className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="text-gray-700 text-sm">
                                <div>Банк: {user.workshop_data.bank}</div>
                                <div>БИК: {user.workshop_data.bic}</div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Футер пользователя */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="grid justify-between items-center text-sm gap-3">
                        <div className="flex items-center gap-2 text-gray-600 p-1.5 bg-white rounded border border-gray-100">
                          <Calendar className="w-3 h-3" />
                          <span>Зарегистрирован:</span>
                          <span className="font-medium">
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {isWorkshop && !workshopAccepted && (
                            <Button
                              onClick={() => handleAcceptWorkshop(user.id)}
                              disabled={isAccepting}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              {isAccepting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckSquare className="w-4 h-4" />
                              )}
                              Подтвердить
                            </Button>
                          )}
                          <button
                            onClick={() =>
                              (window.location.href = `/user/${user.id}`)
                            }
                            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-white transition-colors"
                          >
                            Подробнее
                          </button>
                        </div>
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
