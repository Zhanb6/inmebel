"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import {
  fillDictionaries,
  useAnonimProductsQuery,
  useClientProductsQuery,
  useLikeProduct,
  useProductsQuery,
} from "@/features/product";
import { useAddCart } from "@/features/cart";
import { toast } from "react-toastify";
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Archive,
} from "lucide-react";
import { useSearch } from "@/shared/components/layout/SearchContext";
import FilterModal from "@/shared/components/layout/FilterModal";

export default function Page() {
  const {
    debouncedSearch,
    filters,
    isFilterOpen,
    setIsFilterOpen,
    setResetPage,
  } = useSearch();

  const { data: session } = useSession();
  const userRole = (session as any)?.loginOut?.role;
  const addCartMutation = useAddCart();
  const addLikeCatMutation = useLikeProduct();

  const handleAddToCart = (productId: number) => {
    addCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Товар добавлен в корзину 🛒");
        },
        onError: () => {
          toast.error("Ошибка! Не удалось добавить товар.");
        },
      },
    );
  };

  const handleLikeToCart = (productId: number, isCurrentlyLiked: boolean) => {
    addLikeCatMutation.mutate(productId, {
      onSuccess: () => {
        const action = isCurrentlyLiked ? "удален из" : "добавлен в";
        toast.success(
          `Товар ${action} избранного ${isCurrentlyLiked ? "❤️" : "🛒"}`,
        );
      },
      onError: () => {
        const action = isCurrentlyLiked ? "удалить из" : "добавить в";
        toast.error(`Ошибка! Не удалось ${action} избранного.`);
      },
    });
  };

  const [page, setPage] = useState(1);

  // Параметры запроса
  const queryParams = {
    page,
    perPage: 10,
    search: debouncedSearch,
    category_ids:
      filters.selectedCategories.length > 0
        ? filters.selectedCategories
        : undefined,
    attributes:
      filters.selectedAttributes.length > 0
        ? filters.selectedAttributes
        : undefined,
  };

  // Используем правильный запрос в зависимости от роли
  const anonimProductsQuery = useAnonimProductsQuery(queryParams, {
    enabled: !userRole,
  });

  const workshopProductsQuery = useProductsQuery(queryParams, {
    enabled: userRole === "workshop",
  });

  const clientProductsQuery = useClientProductsQuery(queryParams, {
    enabled: userRole === "client",
  });

  // Выбираем активный запрос на основе роли
  const productsQuery = useMemo(() => {
    if (!userRole) {
      return anonimProductsQuery;
    }
    if (userRole === "workshop") {
      return workshopProductsQuery;
    }
    if (userRole === "client") {
      return clientProductsQuery;
    }
    return workshopProductsQuery; // fallback
  }, [
    userRole,
    anonimProductsQuery,
    workshopProductsQuery,
    clientProductsQuery,
  ]);

  const data = productsQuery.data;
  const isLoading = productsQuery.isLoading;

  const products = useMemo(() => data?.data || [], [data]);

  // Сброс страницы при изменении фильтров или поиска
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  // Сброс флага resetPage
  useEffect(() => {
    if (setResetPage) {
      setResetPage(false);
    }
  }, [setResetPage]);

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center py-2">
      <div className="w-full max-w-[430px] bg-white rounded-[24px] p-4">
        {userRole === "workshop" && (
          <div className="w-full max-w-[400px] mb-4 px-4 flex justify-center">
            <Link href="/product/create">
              <Button className="bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-full px-6 py-2 transition-colors">
                + Создать продукт
              </Button>
            </Link>
          </div>
        )}

        {/* Модальное окно фильтров */}
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        <Tabs defaultValue="mebel" className="w-full max-w-[400px] mb-6">
          <TabsContent value="mebel">
            {isLoading ? (
              <p className="text-center text-[#2E7D32]">Загрузка...</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="relative flex flex-col items-center transition-transform hover:scale-105"
                    >
                      <Link
                        href={`/product/${product.id}`}
                        className="flex flex-col items-center transition-transform hover:scale-105 w-full"
                      >
                        <img
                          src={
                            product.media[0]?.original_url ||
                            "/assets/images/poster.svg"
                          }
                          alt={product.name}
                          className="rounded-[16px] w-[181px] h-[169px] object-contain bg-gray-100"
                        />

                        <div className="flex flex-col items-start mt-2 w-full">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[20px] text-black">
                              {product.price.toLocaleString()} ₸
                            </span>
                            {userRole === "client" && (
                              <div
                                className=" bg-[rgba(0, 0, 0, 0.1)] p-1 rounded-[8px] shadow cursor-pointer"
                                onClick={() => handleAddToCart(product.id)}
                              >
                                <ShoppingCart size={20} />
                              </div>
                            )}
                          </div>
                          <span className="font-normal text-[16px] text-[#000]">
                            {product.name}
                          </span>
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <img src="/assets/images/star.svg" alt="" />
                              <span className="text-[#000] text-[16px]">
                                {product.reviews_avg_star ?? 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#898989] text-[16px]">
                                {product.reviews_count} отзывов
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {userRole === "client" && (
                        <>
                          <div
                            className="absolute top-2 right-2 bg-[rgba(0, 0, 0, 0.1)] p-1 rounded-[8px] shadow cursor-pointer"
                            onClick={() =>
                              handleLikeToCart(
                                product.id,
                                product.user_liked as boolean,
                              )
                            }
                          >
                            <img
                              src={
                                (product.user_liked as any)
                                  ? "/assets/images/heart-red.svg"
                                  : "/assets/images/heart.svg"
                              }
                              alt="like"
                              width={20}
                              height={20}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Пагинация */}
                {/* {data?.meta && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {data.meta.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => link.page && setPage(link.page)}
                        disabled={!link.page}
                        className={`px-3 py-1 rounded-full border ${
                          link.active
                            ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                            : "bg-white text-[#4CAF50] border-[#4CAF50]"
                        } transition`}
                      >
                        <span
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      </button>
                    ))}
                  </div>
                )} */}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
