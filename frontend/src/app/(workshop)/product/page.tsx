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
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Filter,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Page() {
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Состояния для фильтров
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    {
      id?: number;
      value?: string;
      attribute_variant_ids?: number[];
    }[]
  >([]);

  // Состояния для доступных категорий и атрибутов
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);

  // Состояние для раскрытых категорий
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // Загрузка словарей
  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        const dicts = await fillDictionaries();
        setCategories(dicts.categories);
        setAttributes(dicts.attributes);

        // Автоматически раскрываем корневые категории
        const rootCategories = dicts.categories
          .filter((cat: any) => !cat.parent_category_id)
          .map((cat: any) => cat.id);
        setExpandedCategories(rootCategories);
      } catch (err) {
        console.error(err);
      }
    };
    loadDictionaries();
  }, []);

  // Параметры запроса
  const queryParams = {
    page,
    search: debouncedSearch,
    perPage: 10,
    category_ids:
      selectedCategories.length > 0 ? selectedCategories : undefined,
    attributes: selectedAttributes.length > 0 ? selectedAttributes : undefined,
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

  // Debounce поиска 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const products = useMemo(() => data?.data || [], [data]);

  // Построение дерева категорий
  const buildCategoryTree = (
    categories: any[],
    parentId: number | null = null,
    level = 0,
  ): any[] => {
    return categories
      .filter((category) => category.parent_category_id === parentId)
      .map((category) => {
        const children = buildCategoryTree(categories, category.id, level + 1);
        return {
          ...category,
          level,
          children: children.length > 0 ? children : null,
        };
      });
  };

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );

  // Получение всех дочерних категорий
  const getAllChildCategories = (categoryId: number): number[] => {
    const children: number[] = [];

    const findChildren = (parentId: number) => {
      const directChildren = categories.filter(
        (cat) => cat.parent_category_id === parentId,
      );
      directChildren.forEach((child) => {
        children.push(child.id);
        findChildren(child.id);
      });
    };

    findChildren(categoryId);
    return children;
  };

  // Обработчик переключения категории
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      // При выборе категории добавляем ее и всех ее детей
      const children = getAllChildCategories(categoryId);
      setSelectedCategories((prev) => [...prev, categoryId, ...children]);
    } else {
      // При снятии выбора убираем категорию и всех ее детей
      const children = getAllChildCategories(categoryId);
      setSelectedCategories((prev) =>
        prev.filter((id) => id !== categoryId && !children.includes(id)),
      );
    }
  };

  // Обработчик раскрытия/сворачивания категории
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  // Рекурсивный рендер дерева категорий
  const renderCategoryTree = (tree: any[]) => {
    return tree.map((category) => (
      <div key={category.id} className="w-full">
        <div className="flex items-center gap-1 py-1">
          <div style={{ width: `${category.level * 20}px` }} />

          {category.children ? (
            <button
              onClick={() => toggleCategoryExpansion(category.id)}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center"
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <div className="w-4" /> // placeholder для выравнивания
          )}

          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={(e) =>
                handleCategoryChange(category.id, e.target.checked)
              }
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-sm">
              {category.name}
              {category.product_count !== undefined && (
                <span className="text-gray-500 ml-1">
                  ({category.product_count})
                </span>
              )}
            </span>
          </label>
        </div>

        {category.children && expandedCategories.includes(category.id) && (
          <div className="ml-4">{renderCategoryTree(category.children)}</div>
        )}
      </div>
    ));
  };

  const handleAttributeChange = (
    attributeId: number,
    value: any,
    type: string,
  ) => {
    setSelectedAttributes((prev) => {
      const existingIndex = prev.findIndex((attr) => attr.id === attributeId);

      if (existingIndex >= 0) {
        // Обновляем существующий атрибут
        const updated = [...prev];
        if (type === "select") {
          updated[existingIndex] = {
            id: attributeId,
            attribute_variant_ids: value,
          };
        } else {
          updated[existingIndex] = {
            id: attributeId,
            value: value,
          };
        }
        return updated;
      } else {
        // Добавляем новый атрибут
        if (type === "select") {
          return [...prev, { id: attributeId, attribute_variant_ids: value }];
        } else {
          return [...prev, { id: attributeId, value: value }];
        }
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAttributes([]);
    setPage(1);
  };

  const applyFilters = () => {
    setPage(1);
    setIsFilterOpen(false);
  };

  // Получение атрибутов для выбранных категорий
  const getAttributesForSelectedCategories = () => {
    if (selectedCategories.length === 0) return [];

    return attributes.filter((attr) =>
      attr.categories.some((cat: any) => selectedCategories.includes(cat.id)),
    );
  };

  const filteredAttributes = getAttributesForSelectedCategories();

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-[#1B5E20] py-10 mx-6">
      <div className="relative w-full flex items-center justify-center mb-6">
        <h1 className="font-bold text-[32px] text-black">Mebelapp</h1>

        {userRole === "client" && (
          <div className="absolute right-0 flex gap-1">
            <Link href="/cart">
              <div className="bg-[#F5F5F5] w-[40px] h-[40px] rounded-full flex items-center justify-center shadow">
                <ShoppingCart size={20} />
              </div>
            </Link>
            <Link href="/like">
              <div className="bg-[#F5F5F5] w-[40px] h-[40px] rounded-full flex items-center justify-center shadow">
                <Heart size={20} />
              </div>
            </Link>
          </div>
        )}
      </div>

      <Image
        src="/assets/images/mebel.svg"
        alt="Описание мебели"
        width={500}
        height={300}
        className="rounded-xl shadow-lg mb-6"
      />

      {userRole === "workshop" && (
        <div className="w-full max-w-[400px] mb-4 px-4 flex justify-center">
          <Link href="/product/create">
            <Button className="bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-full px-6 py-2 transition-colors">
              + Создать продукт
            </Button>
          </Link>
        </div>
      )}

      {/* Поиск и фильтры */}
      <div className="w-full max-w-[361px] mb-6 flex gap-2">
        <Input
          type="search"
          placeholder="Поиск Продукта"
          className="flex-1 h-[48px] rounded-full border border-[#66BB6A] focus:border-[#388E3C] focus:ring-[#66BB6A] text-center focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-[48px] w-[48px] rounded-full border-[#66BB6A] flex items-center justify-center relative"
            >
              <Filter size={20} />
              {(selectedCategories.length > 0 ||
                selectedAttributes.length > 0) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {selectedCategories.length + selectedAttributes.length}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Фильтры</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500"
                >
                  Очистить все
                </Button>
              </DialogTitle>
            </DialogHeader>

            {/* Фильтр по категориям */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Категории</h3>
                <div className="max-h-60 overflow-y-auto space-y-1 border rounded-lg p-3">
                  {categoryTree.length > 0 ? (
                    renderCategoryTree(categoryTree)
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Загрузка категорий...
                    </p>
                  )}
                </div>
              </div>

              {/* Фильтр по атрибутам */}
              {filteredAttributes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Атрибуты</h3>
                  <div className="space-y-3">
                    {filteredAttributes.map((attr) => {
                      const currentAttr = selectedAttributes.find(
                        (a) => a.id === attr.id,
                      );

                      return (
                        <div key={attr.id} className="border rounded-lg p-3">
                          <label className="font-medium block mb-2">
                            {attr.name}
                          </label>

                          {attr.type === "integer" && (
                            <input
                              type="number"
                              value={currentAttr?.value || ""}
                              onChange={(e) =>
                                handleAttributeChange(
                                  attr.id,
                                  e.target.value,
                                  "integer",
                                )
                              }
                              placeholder="Введите значение"
                              className="w-full border rounded px-3 py-2 text-sm"
                            />
                          )}

                          {attr.type === "select" && (
                            <select
                              multiple
                              value={
                                currentAttr?.attribute_variant_ids ||
                                ([] as any)
                              }
                              onChange={(e) => {
                                const selectedValues = Array.from(
                                  e.target.selectedOptions,
                                ).map((option) => Number(option.value));
                                handleAttributeChange(
                                  attr.id,
                                  selectedValues,
                                  "select",
                                );
                              }}
                              className="w-full border rounded px-3 py-2 text-sm"
                            >
                              {attr.variants.map((variant: any) => (
                                <option
                                  key={variant.id}
                                  value={variant.id as any}
                                >
                                  {variant.value}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={applyFilters}
                className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C]"
              >
                Применить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="mebel" className="w-full max-w-[400px] mb-6 px-4">
        <div className="flex justify-center mb-4">
          <TabsList className="bg-[#C8E6C9] rounded-full p-1">
            <TabsTrigger
              value="mebel"
              className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white rounded-full transition-all"
            >
              Каталог Продуктов
            </TabsTrigger>
          </TabsList>
        </div>

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
                      <Image
                        src={
                          product.media[0]?.original_url ||
                          "/assets/images/poster.svg"
                        }
                        alt={product.name}
                        width={179}
                        height={209}
                        className="rounded-[10px] shadow-md h-[209px]"
                      />
                      <div className="flex flex-col items-start mt-2 w-full">
                        <span className="font-medium text-[12px] text-black">
                          {product.name}
                        </span>
                        <span className="font-semibold text-[14px] text-black">
                          {product.price.toLocaleString()} ТГ
                        </span>
                      </div>
                    </Link>
                    {userRole === "client" && (
                      <div
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
                        onClick={() =>
                          handleLikeToCart(
                            product.id,
                            product.user_liked as boolean,
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill={(product.user_liked as any) ? "red" : "none"}
                          viewBox="0 0 24 24"
                          stroke={(product.user_liked as any) ? "red" : "#444"}
                          strokeWidth="2"
                        >
                          <path d="M12 21s-6-4.35-9-8.5S4.5 3 8 4.5C10 5.5 12 8 12 8s2-2.5 4-3.5C19.5 3 22 7 21 12.5S12 21 12 21z" />
                        </svg>
                      </div>
                    )}

                    {userRole === "client" && (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="mt-2 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-full shadow-sm hover:bg-green-600 hover:scale-105 transition-transform duration-150 flex items-center justify-center gap-1"
                      >
                        🛒 Добавить
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              {data?.meta && (
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
                      <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
