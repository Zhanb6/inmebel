"use client";

import { useProductId } from "@/features/product/hooks/useProduct";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Package,
  Calendar,
  Hash,
  Star,
  MessageSquare,
  Heart,
  Tag,
  Image as ImageIcon,
  Ruler,
  Layers,
  Palette,
  CheckCircle,
  ChevronRight,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  Grid,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";

export default function ProductId() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProductId(Number(id));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isLoading)
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-[400px] rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-20 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-center p-8 text-red-500 bg-gray-50 rounded-lg mt-4 border border-gray-200">
        Ошибка загрузки товара
      </div>
    );

  if (!data)
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50 mt-4 border-gray-200">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Товар не найден</h3>
        <p className="text-gray-500">Товар с ID {id} не существует</p>
      </div>
    );

  const product: any = (data as any).data;
  const images = product.media || [];
  const categories = product.categories || [];
  const attributes = product.attributes || [];
  const reviews = product.reviews || [];

  const avgRating = product.reviews_avg_star;
  const reviewsCount = product.reviews_count;
  const commentsCount = product.reviews_with_comment_count;

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

  // Группируем атрибуты по типам
  const numericAttributes = attributes.filter(
    (attr: any) => attr.attribute_type === "integer"
  );
  const selectAttributes = attributes.filter(
    (attr: any) => attr.attribute_type === "select"
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <ChevronRight className="w-4 h-4" />
        <span>Товары</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-700">{product.name}</span>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Левая колонка: Изображения */}
        <div className="space-y-4">
          {/* Главное изображение */}
          <Card className="border-gray-200 overflow-hidden">
            <CardContent className="p-0">
              <div
                className="relative aspect-square bg-gray-100 cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]?.original_url}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-300 ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-24 h-24 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 rounded-lg backdrop-blur-sm hover:bg-white">
                    <Heart
                      className="w-5 h-5"
                      fill={product.user_liked ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                {isZoomed && (
                  <div className="absolute bottom-4 right-4">
                    <ZoomIn className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Миниатюры */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-gray-800"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image.original_url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Информация о доставке */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Доставка</div>
                    <div className="text-sm text-gray-500">
                      По всему Казахстану
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Гарантия</div>
                    <div className="text-sm text-gray-500">12 месяцев</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: Информация о товаре */}
        <div className="space-y-6">
          {/* Заголовок и цена */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="font-mono bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700"
                  >
                    <Hash className="w-3 h-3 mr-1" />#{product.id}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(product.created_at)}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Рейтинг и отзывы */}
            <div className="flex items-center gap-4 mb-4">
              {avgRating !== null && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(avgRating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <MessageSquare className="w-4 h-4" />
                <span>{reviewsCount} отзывов</span>
                {commentsCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{commentsCount} с комментариями</span>
                  </>
                )}
              </div>
            </div>

            {/* Цена */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {parseFloat(product.price).toLocaleString("ru-RU")} ₸
              </div>
              <div className="text-sm text-gray-500">
                Цена включает НДС и доставку
              </div>
            </div>
          </div>

          {/* Категории */}
          {categories.length > 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium text-gray-700">Категории</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: any) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Описание */}
          {product.description && (
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">Описание</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Атрибуты */}
          {(numericAttributes.length > 0 || selectAttributes.length > 0) && (
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  Характеристики
                </h3>
                <div className="space-y-3">
                  {/* Числовые атрибуты */}
                  {numericAttributes.map((attr: any) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-gray-600">
                        {attr.attribute === "Длина" && (
                          <Ruler className="w-4 h-4" />
                        )}
                        {attr.attribute === "Высота" && (
                          <Grid className="w-4 h-4" />
                        )}
                        {attr.attribute === "Глубина" && (
                          <Layers className="w-4 h-4" />
                        )}
                        {attr.attribute}
                      </div>
                      <div className="font-medium text-gray-800">
                        {attr.value}{" "}
                        {attr.attribute === "Материалы" ? "" : "см"}
                      </div>
                    </div>
                  ))}

                  {/* Селект атрибуты */}
                  {selectAttributes.map((attr: any) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-gray-600">
                        {attr.attribute === "Материалы" && (
                          <Palette className="w-4 h-4" />
                        )}
                        {attr.attribute}
                      </div>
                      <div className="space-y-1">
                        {attr.variants.map((variant: any) => (
                          <div
                            key={variant.id}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-gray-800">
                              {variant.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Отзывы (превью) */}
          {reviews.length > 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700">
                    Последние отзывы
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Все отзывы
                  </button>
                </div>
                <div className="space-y-3">
                  {reviews.slice(0, 2).map((review: any) => (
                    <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.star
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 text-sm">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
