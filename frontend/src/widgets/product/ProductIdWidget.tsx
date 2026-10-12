"use client";

import {
  useClientShowProductQuery,
  useShowAnonimProductQuery,
  useShowProductQuery,
} from "@/features/product";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ProductComment } from "./ProductComment";
import { useMemo } from "react";
import { ProductDelete } from "./ProductDelete";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export function ProductIdWidget() {
  const params = useParams();
  const requestId = parseInt(params.id as string, 10);

  const { data: session } = useSession();
  const userRole = (session as any)?.loginOut?.role;

  // Используем правильный запрос в зависимости от роли
  const anonimProductQuery = useShowAnonimProductQuery(requestId, {
    enabled: !userRole,
  });

  const workshopProductQuery = useShowProductQuery(requestId, {
    enabled: userRole === "workshop",
  });

  const clientProductQuery = useClientShowProductQuery(requestId, {
    enabled: userRole === "client",
  });

  // Выбираем активный запрос на основе роли
  const productQuery = useMemo(() => {
    if (!userRole) {
      return anonimProductQuery;
    }
    if (userRole === "workshop") {
      return workshopProductQuery;
    }
    if (userRole === "client") {
      return clientProductQuery;
    }
    return workshopProductQuery; // fallback
  }, [userRole, anonimProductQuery, workshopProductQuery, clientProductQuery]);

  const product = productQuery.data;
  const productData = product?.data;
  const isLoading = productQuery.isLoading;
  const isError = productQuery.isError;

  if (isLoading) return <div>Загрузка...</div>;
  if (isError || !productData) return <div>Продукт не найден</div>;

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center py-2 space-y-4 grid">
      {/* Контейнер продукта */}
      <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
        <ProductDelete />

        {/* Product Image */}
        {/* Product Image */}
        <div className="w-full flex justify-center">
          {productData.media?.length ? (
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                bulletClass:
                  "swiper-pagination-bullet w-3 h-3 rounded-full bg-gray-300", // обычные точки
                bulletActiveClass:
                  "swiper-pagination-bullet-active bg-green-500", // активная точка зелёная
              }}
              spaceBetween={10}
              slidesPerView={1}
              className="w-full max-w-[361px] rounded-xl"
            >
              {productData.media.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={img.original_url ?? "/assets/images/mebel.svg"}
                    alt={productData.name ?? "Продукт"}
                    width={361}
                    height={256}
                    className="rounded-xl h-[256px] object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src="/assets/images/mebel.svg"
              alt="Продукт"
              width={361}
              height={256}
              className="rounded-xl h-[256px]"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="pt-2.5">
          <h2 className="text-[20px] font-medium leading-tight">
            {productData.name ?? "Название отсутствует"}
          </h2>
          <p className="text-xl font-semibold text-black">
            {(productData.price ?? 0).toLocaleString()} ₸
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
        <h3 className="font-semibold text-base mb-2">Описание мебели</h3>
        <p className="text-sm text-gray-600 mb-2">
          {productData.description ?? "Описание отсутствует"}
        </p>
        <div className="text-sm text-gray-700 flex flex-wrap gap-2">
          {productData.categories?.length ? (
            productData.categories.map((cat) => (
              <span key={cat.id} className="px-2 py-1 bg-gray-100 rounded">
                {cat.name}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 bg-gray-100 rounded">
              Категории отсутствуют
            </span>
          )}
        </div>
      </div>

      {/* Attributes */}
      <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
        <h3 className="font-semibold text-base mb-1">Характеристики</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          {productData.attributes?.length ? (
            productData.attributes.map((attr: any) => (
              <li key={attr.id}>
                {attr.attribute}:{" "}
                {attr.value ??
                  attr.variants?.map((v: any) => v.value).join(", ") ??
                  "—"}
              </li>
            ))
          ) : (
            <li>Характеристики отсутствуют</li>
          )}
        </ul>
      </div>
      <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4 space-y-4 mb-16">
        {/* Общее количество отзывов и вопросов */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 bg-[rgba(88,171,65,0.1)] w-[180px] h-[58px] p-2 rounded-[10px]">
            <div className="grid ">
              <div className="flex items-center gap-1">
                <img src="/assets/images/star.svg" alt="" />
                <span className="text-[#000] text-[16px]">
                  {productData.reviews_avg_star ?? 0}
                </span>
              </div>
              <span className="text-[#91847a] text-[16px]">
                {productData.reviews_count} отзывов
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[rgba(88,171,65,0.1)] w-[152px] h-[58px] p-2 rounded-[10px]">
            <div className="grid ">
              <div className="flex items-center gap-1">
                <img src="/assets/images/message-text.svg" alt="" />
                <span className="text-[#000] text-[16px]">36</span>
              </div>
              <span className="text-[#91847a] text-[16px]">вопросов</span>
            </div>
          </div>
        </div>

        {/* Отзывы */}
        <div className="space-y-4">
          {/* Добавляем динамические отзывы */}
          {productData.reviews?.length ? (
            productData.reviews.slice(0, 4).map((rev, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <div className="grid">
                    <span>{rev.person_name ?? "Аноним"}</span>
                    <span className="text-[#9b9b9b] text-[12px] text-left">
                      {/* Здесь можно добавить вариант товара если есть в данных */}
                      {rev.variant ?? "стандартный"}
                    </span>
                  </div>
                  <div className="grid">
                    <div className="flex items-center">
                      {/* Звезды рейтинга */}
                      {[...Array(5)].map((_, starIndex) => (
                        <img
                          key={starIndex}
                          src={
                            starIndex < Math.floor(rev.star ?? 0)
                              ? "/assets/images/star.svg"
                              : "/assets/images/star-none.svg"
                          }
                          alt=""
                        />
                      ))}
                    </div>
                    <span className="text-[#9b9b9b] text-[12px] text-right">
                      {/* Здесь можно добавить дату если есть в данных */}
                      {rev.date ?? "Дата не указана"}
                    </span>
                  </div>
                </div>

                {/* Изображения отзыва (оставляем как есть) */}
                <div className="flex gap-1 mt-2">
                  <img
                    src="/assets/images/poster.svg"
                    alt="review"
                    className="w-[33px] h-[42px] rounded-[6px]"
                  />
                  <img
                    src="/assets/images/poster.svg"
                    alt="review"
                    className="w-[33px] h-[42px] rounded-[6px]"
                  />
                  <img
                    src="/assets/images/poster.svg"
                    alt="review"
                    className="w-[33px] h-[42px] rounded-[6px]"
                  />
                </div>

                {/* Текст отзыва из данных */}
                <p className="text-sm text-gray-700 mt-2">
                  {rev.comment ?? "Комментарий отсутствует"}
                </p>
                <span className="text-blue-600 text-sm cursor-pointer">
                  Читать полностью
                </span>
              </div>
            ))
          ) : (
            /* Если нет отзывов, показываем статические */
            <>
              <div></div>
            </>
          )}
        </div>

        <hr className="border-gray-200 mt-4" />

        {/* Ссылка на все отзывы */}
        <div className="text-sm text-gray-500 mt-2 flex justify-between items-center cursor-pointer">
          <span>Читать все отзывы (ещё 43 отзыва)</span>
          <span>→</span>
        </div>
      </div>

      {/* Reviews */}

      {userRole === "client" && (
        <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4 mb-[120px]">
          <ProductComment />
        </div>
      )}
    </div>
  );
}
