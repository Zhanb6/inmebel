"use client";

import { useUserId } from "@/features/user/hooks/useUser";
import { useUserOrders } from "@/features/user/hooks/useUser";
import { useUserRequests } from "@/features/user/hooks/useUser";
import { useUserLikes } from "@/features/user/hooks/useUser";
import { useUserCart } from "@/features/user/hooks/useUser";
import { useUserProducts } from "@/features/user/hooks/useUser";
import { useWorkshopUpdate } from "@/features/user/hooks/useUser";
import { useClientUpdate } from "@/features/user/hooks/useUser";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";

import {
  User,
  Phone,
  MapPin,
  Calendar,
  Building,
  Hash,
  Shield,
  ShoppingBag,
  UserCircle,
  Mail,
  IdCard,
  CreditCard,
  Map,
  Info,
  Home,
  Award,
  MessageSquare,
  Edit,
  Package,
  Heart,
  ShoppingCart,
  ListOrdered,
  FileText,
  Star,
  Tag,
  AlertCircle,
} from "lucide-react";
import { WorkshopModal } from "@/shared/components/modals/WorkshopModal";
import { ClientModal } from "@/shared/components/modals/ClientModal";

export default function UserId() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUser,
  } = useUserId(Number(id));
  const { data: ordersData, isLoading: ordersLoading } = useUserOrders(
    Number(id)
  ) as { data: any; isLoading: boolean };

  const { data: requestsData, isLoading: requestsLoading } = useUserRequests(
    Number(id)
  ) as { data: any; isLoading: boolean };

  const { data: likesData, isLoading: likesLoading } = useUserLikes(
    Number(id)
  ) as { data: any; isLoading: boolean };

  const { data: cartData, isLoading: cartLoading } = useUserCart(
    Number(id)
  ) as { data: any; isLoading: boolean };

  const { data: productsData, isLoading: productsLoading } = useUserProducts(
    Number(id)
  ) as { data: any; isLoading: boolean };

  const { mutate: updateWorkshop, isPending: isUpdatingWorkshop } =
    useWorkshopUpdate();
  const { mutate: updateClient, isPending: isUpdatingClient } =
    useClientUpdate();

  const handleWorkshopUpdate = async (workshopData: any) => {
    updateWorkshop(
      { id: Number(id), payload: workshopData },
      {
        onSuccess: () => {
          setIsWorkshopModalOpen(false);
          refetchUser();
        },
        onError: (error) => {
          console.error("Ошибка обновления мастерской:", error);
        },
      }
    );
  };

  const handleClientUpdate = async (clientData: any) => {
    updateClient(
      { id: Number(id), payload: clientData },
      {
        onSuccess: () => {
          setIsClientModalOpen(false);
          refetchUser();
        },
        onError: (error) => {
          console.error("Ошибка обновления клиента:", error);
        },
      }
    );
  };

  if (userLoading) return <UserLoadingSkeleton />;
  if (userError) return <UserErrorState id={id} />;

  const user: any = (userData as any)?.data;
  if (!user) return <UserNotFound id={id} />;

  const isAdmin = user.role === "admin";
  const isWorkshop = user.role === "workshop";
  const isClient = user.role === "client";

  const workshopData = user.workshop_data;
  const clientData = user.client_data;

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Функция для форматирования суммы
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₸";
  };

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

  // Статистика
  const ordersCount: any = (ordersData as any)?.data?.length || 0;
  const requestsCount: any = (requestsData as any)?.data?.length || 0;
  const likesCount: any = (likesData as any)?.data?.length || 0;
  const productsCount: any = (productsData as any)?.data?.length || 0;
  const cartItemsCount: any = (cartData as any)?.data?.items?.length || 0;

  // Компоненты для каждой вкладки
  const UserInfoTab = () => (
    <div className="space-y-6">
      {/* Кнопка редактирования в зависимости от роли */}
      <div className="flex justify-end">
        {(isWorkshop || isClient) && (
          <Button
            onClick={() => {
              if (isWorkshop) setIsWorkshopModalOpen(true);
              if (isClient) setIsClientModalOpen(true);
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {isWorkshop ? "Редактировать мастерскую" : "Редактировать клиента"}
          </Button>
        )}
      </div>

      {/* Основная информация */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Контактная информация
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-green-50 rounded">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Телефон</div>
                <a
                  href={`tel:${user.phone}`}
                  className="font-medium text-gray-800 hover:text-blue-600"
                >
                  {user.phone}
                </a>
              </div>
            </div>

            {(isWorkshop || isClient) && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-purple-50 rounded">
                  <IdCard className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">ИИН</div>
                  <div className="font-medium text-gray-800">
                    {isWorkshop ? workshopData?.iin : clientData?.iin}
                  </div>
                </div>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-blue-50 rounded">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-800">{user.email}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-amber-50 rounded">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Роль в системе</div>
                <div className="font-medium text-gray-800">
                  {isAdmin && "Администратор"}
                  {isWorkshop && "Владелец мастерской"}
                  {isClient && "Клиент"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительная информация в зависимости от роли */}
      {isWorkshop && workshopData && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Информация о мастерской
                </h2>
              </div>
              <Button
                onClick={() => setIsWorkshopModalOpen(true)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Название компании</div>
                  <div className="font-medium text-gray-800 text-lg">
                    {workshopData.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Директор</div>
                  <div className="font-medium text-gray-800">
                    {workshopData.director_name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="p-2 bg-blue-50 rounded mt-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Адрес</div>
                    <div className="font-medium text-gray-800">
                      {workshopData.address}
                    </div>
                  </div>
                </div>
                {workshopData.city && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="p-2 bg-green-50 rounded">
                      <Map className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Город</div>
                      <div className="font-medium text-gray-800">
                        {workshopData.city}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {workshopData.bank && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">
                    Банковские реквизиты
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="p-2 bg-purple-50 rounded">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Банк</div>
                        <div className="font-medium text-gray-800">
                          {workshopData.bank}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="p-2 bg-amber-50 rounded">
                        <Hash className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">БИК</div>
                        <div className="font-medium text-gray-800">
                          {workshopData.bic}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isClient && clientData && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Информация о клиенте
                </h2>
              </div>
              <Button
                onClick={() => setIsClientModalOpen(true)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Редактировать
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-blue-50 rounded">
                  <IdCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">ИИН</div>
                  <div className="font-medium text-gray-800">
                    {clientData.iin}
                  </div>
                </div>
              </div>

              {clientData.address && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="p-2 bg-green-50 rounded mt-1">
                    <Home className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Адрес доставки</div>
                    <div className="font-medium text-gray-800">
                      {clientData.address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-4">
      {ordersLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : ordersData?.data?.length ? (
        <div className="space-y-4">
          {ordersData.data.map((order: any) => (
            <Card key={order.id} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        Заказ #{order.id}
                      </Badge>
                      <Badge
                        className={getOrderStatusColor(order.order_status?.id)}
                      >
                        {order.order_status?.name || "Неизвестно"}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg">
                      {formatPrice(order.price)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Мастерская: {order.workshop?.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </div>
                </div>

                <div className="space-y-3">
                  {order.products?.map((product: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {product.media?.[0]?.original_url ? (
                        <img
                          src={product.media[0].original_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.pivot?.quantity} ×{" "}
                          {formatPrice(product.pivot?.price || product.price)}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.categories?.map((cat: any) => (
                            <Badge
                              key={cat.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatPrice(
                          (product.pivot?.quantity || 1) *
                            (product.pivot?.price || product.price)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 border-gray-200">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Нет заказов</h3>
          <p className="text-gray-500">Пользователь пока не совершал заказов</p>
        </div>
      )}
    </div>
  );

  const RequestsTab = () => (
    <div className="space-y-4">
      {requestsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : requestsData?.data?.length ? (
        <div className="space-y-4">
          {requestsData.data.map((request: any) => (
            <Card key={request.id} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        Заявка #{request.id}
                      </Badge>
                      <Badge
                        className={getRequestStatusColor(
                          request.request_status?.id
                        )}
                      >
                        {request.request_status?.name || "Неизвестно"}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg">
                      {formatPrice(request.price)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Тип мебели: {request.furniture_type?.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(request.created_at)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Клиент</div>
                    <div className="font-medium">{request.client_name}</div>
                    <div className="text-sm text-gray-500">
                      {request.client_phone}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Мастерская</div>
                    <div className="font-medium">{request.workshop?.name}</div>
                    <div className="text-sm text-gray-500">
                      {request.client_address}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 border-gray-200">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Нет заявок</h3>
          <p className="text-gray-500">Пользователь пока не оставлял заявок</p>
        </div>
      )}
    </div>
  );

  const LikesTab = () => (
    <div className="space-y-4">
      {likesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : likesData?.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {likesData.data.map((product: any) => (
            <Card
              key={product.id}
              className="border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                  {product.media?.[0]?.original_url ? (
                    <img
                      src={product.media[0].original_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg truncate">{product.name}</h3>
                  <div className="font-bold text-xl">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.categories?.map((cat: any) => (
                      <Badge key={cat.id} variant="outline" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4" />
                      <span>{product.reviews_avg_star || 0}</span>
                      <span>({product.reviews_count || 0})</span>
                    </div>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 border-gray-200">
          <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            Нет избранного
          </h3>
          <p className="text-gray-500">
            Пользователь пока ничего не добавил в избранное
          </p>
        </div>
      )}
    </div>
  );

  const CartTab = () => (
    <div className="space-y-4">
      {cartLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : cartData?.data?.items?.length ? (
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Корзина пользователя</h3>
              <p className="text-gray-500">Всего товаров: {cartItemsCount}</p>
            </div>
            <div className="space-y-4">
              {cartData.data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {item.media?.[0]?.original_url ? (
                    <img
                      src={item.media[0].original_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatPrice(item.price)}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.categories?.map((cat: any) => (
                        <Badge
                          key={cat.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="font-medium">{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>
            {cartData.data.total && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Итого:</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(cartData.data.total)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 border-gray-200">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Корзина пуста</h3>
          <p className="text-gray-500">
            В корзине пользователя пока нет товаров
          </p>
        </div>
      )}
    </div>
  );

  const ProductsTab = () => (
    <div className="space-y-4">
      {productsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : productsData?.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsData.data.map((product: any) => (
            <Card
              key={product.id}
              className="border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                  {product.media?.[0]?.original_url ? (
                    <img
                      src={product.media[0].original_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg truncate">{product.name}</h3>
                  <div className="font-bold text-xl">
                    {formatPrice(product.price)}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {product.categories?.map((cat: any) => (
                      <Badge key={cat.id} variant="outline" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-gray-500">
                      {formatDate(product.created_at)}
                    </div>
                    {product.user_liked && (
                      <Heart className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 border-gray-200">
          <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Нет продуктов</h3>
          <p className="text-gray-500">
            Пользователь пока не создавал продукты
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Модальные окна */}
      {isWorkshop && (
        <WorkshopModal
          isOpen={isWorkshopModalOpen}
          onClose={() => setIsWorkshopModalOpen(false)}
          initialData={workshopData}
          onSubmit={handleWorkshopUpdate}
          isLoading={isUpdatingWorkshop}
        />
      )}

      {isClient && (
        <ClientModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          initialData={clientData}
          onSubmit={handleClientUpdate}
          isLoading={isUpdatingClient}
        />
      )}

      {/* Заголовок и основная информация */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <UserCircle className="w-12 h-12 text-gray-600" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user.name}
              </h1>
              <Badge
                className={`${getRoleColor(user.role)} text-sm font-medium`}
              >
                <div className="flex items-center gap-1">
                  {getRoleIcon(user.role)}
                  {isAdmin && "Администратор"}
                  {isWorkshop && "Мастерская"}
                  {isClient && "Клиент"}
                </div>
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                <span className="font-mono">ID: {user.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Редактировать
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Написать
          </button>
        </div>
      </div>

      {/* Статистика в карточках */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<ListOrdered className="w-6 h-6 text-blue-600" />}
          label="Заказы"
          value={ordersCount}
          color="blue"
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-green-600" />}
          label="Заявки"
          value={requestsCount}
          color="green"
        />
        <StatCard
          icon={<Heart className="w-6 h-6 text-red-600" />}
          label="Избранное"
          value={likesCount}
          color="red"
        />
        <StatCard
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
          label="Корзина"
          value={cartItemsCount}
          color="purple"
        />
        <StatCard
          icon={<Tag className="w-6 h-6 text-amber-600" />}
          label="Продукты"
          value={productsCount}
          color="amber"
        />
      </div>

      {/* Табы для разделов */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span className="hidden md:inline">Информация</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4" />
                <span className="hidden md:inline">Заказы</span>
                {ordersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {ordersCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden md:inline">Заявки</span>
                {requestsCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {requestsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden md:inline">Избранное</span>
                {likesCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {likesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden md:inline">Корзина</span>
                {cartItemsCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {cartItemsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="hidden md:inline">Продукты</span>
                {productsCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {productsCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <UserInfoTab />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="requests">
              <RequestsTab />
            </TabsContent>

            <TabsContent value="likes">
              <LikesTab />
            </TabsContent>

            <TabsContent value="cart">
              <CartTab />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Вспомогательные компоненты
const UserLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
    <Skeleton className="h-[400px]" />
  </div>
);

const UserErrorState = ({ id }: { id: string | undefined }) => (
  <div className="text-center p-8 bg-red-50 rounded-lg mt-4 border border-red-200">
    <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
    <h3 className="text-lg font-semibold text-red-700">Ошибка загрузки</h3>
    <p className="text-red-600">Не удалось загрузить пользователя {id}</p>
  </div>
);

const UserNotFound = ({ id }: { id: string | undefined }) => (
  <div className="text-center p-8 border rounded-lg bg-gray-50 mt-4 border-gray-200">
    <UserCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700">
      Пользователь не найден
    </h3>
    <p className="text-gray-500">Пользователь с ID {id} не существует</p>
  </div>
);

const StatCard = ({ icon, label, value, color }: any) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    purple: "bg-purple-50 border-purple-200",
    amber: "bg-amber-50 border-amber-200",
  };

  return (
    <Card
      className={`${colorClasses[color as keyof typeof colorClasses]} border`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          <div className="p-2 bg-white rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Вспомогательные функции
const getOrderStatusColor = (statusId: number) => {
  switch (statusId) {
    case 1: // В обработке
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 2: // Подтвержден
      return "bg-green-100 text-green-800 border-green-200";
    case 3: // Отклонен
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRequestStatusColor = (statusId: number) => {
  switch (statusId) {
    case 1: // Новая заявка
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 2: // В работе
      return "bg-amber-100 text-amber-800 border-amber-200";
    case 3: // Завершена
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
