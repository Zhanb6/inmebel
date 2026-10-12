"use client";

import { useProducts } from "@/features/product/hooks/useProduct";
import UsersSkeleton from "@/shared/components/block/users-skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import Pagination from "@/shared/components/ui/pagination";

import {
  Package,
  DollarSign,
  Calendar,
  Hash,
  Search,
  Star,
  MessageSquare,
  Heart,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Product() {
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

  // Используем хук useProducts с параметрами для пагинации и поиска
  const { data, isLoading, isError } = useProducts({
    page: currentPage,
    perPage: 10,
    search: debouncedSearch,
  });

  if (isLoading) return <UsersSkeleton />;

  if (isError)
    return (
      <div className="text-center p-8 text-red-500 bg-white rounded-lg mt-4 border border-gray-200">
        Ошибка загрузки товаров
      </div>
    );

  // Извлекаем продукты из data.data согласно структуре ответа
  const products: any = (data as any).data;
  const meta: any = (data as any).meta;

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по названию товара..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-center p-8 border rounded-lg bg-white mt-4 border-gray-200">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Нет товаров</h3>
          <p className="text-gray-500">Товары пока не добавлены</p>
        </div>
      </>
    );
  }

  // Рассчитываем статистику
  const totalProducts = meta?.total || products.length;
  const totalPrice = products.reduce((sum: number, product: any) => {
    const price = parseFloat(product.price) || 0;
    return sum + price;
  }, 0);
  const avgPrice = totalPrice / products.length || 0;

  const categories = new Set(
    products.flatMap(
      (product: any) => product.categories?.map((cat: any) => cat.name) || []
    )
  );

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего товаров</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalProducts}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Средняя цена</p>
                <p className="text-2xl font-bold text-gray-800">
                  {avgPrice.toLocaleString("ru-RU")} ₸
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
                <p className="text-sm text-gray-600">Категорий</p>
                <p className="text-2xl font-bold text-gray-800">
                  {categories.size}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Tag className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по названию товара..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Список товаров */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Товары ({totalProducts})
          </h2>
          <div className="text-sm text-gray-500">
            Страница {meta?.current_page || 1} из {meta?.last_page || 1}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any) => {
            const mainImage = product.media?.[0]?.original_url;
            const avgRating = product.reviews_avg_star;
            const reviewsCount = product.reviews_count;
            const commentsCount = product.reviews_with_comment_count;

            return (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-all duration-200 bg-white border-gray-200 hover:border-gray-300"
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Изображение товара */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="outline"
                          className="font-mono bg-white/90 hover:bg-white border-gray-300 text-gray-700 backdrop-blur-sm"
                        >
                          <Hash className="w-3 h-3 mr-1" />#{product.id}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          className={`p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white ${
                            product.user_liked
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={product.user_liked ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Информация о товаре */}
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description || "Описание отсутствует"}
                      </p>

                      {/* Категории */}
                      {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.categories
                            .slice(0, 2)
                            .map((category: any) => (
                              <Badge
                                key={category.id}
                                variant="outline"
                                className="text-xs bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
                              >
                                {category.name}
                              </Badge>
                            ))}
                          {product.categories.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
                            >
                              +{product.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Цена и рейтинг */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-gray-900">
                            {parseFloat(product.price).toLocaleString("ru-RU")}{" "}
                            ₸
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(product.created_at)}
                          </div>
                        </div>

                        {/* Рейтинг и отзывы */}
                        <div className="text-right">
                          {avgRating !== null && (
                            <div className="flex items-center gap-1 justify-end">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-medium text-gray-800">
                                {avgRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MessageSquare className="w-3 h-3" />
                            <span>{reviewsCount} отзывов</span>
                            {commentsCount > 0 && (
                              <>
                                <span>•</span>
                                <span>{commentsCount} с комментариями</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Футер карточки */}
                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={() =>
                          (window.location.href = `/product/${product.id}`)
                        }
                        className="w-full px-4 py-2 text-sm text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        Подробнее
                      </button>
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
