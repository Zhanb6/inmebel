"use client";

import Image from "next/image";
import { useSearch } from "./SearchContext";
import { Filter, ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const { search, setSearch, filters, setIsFilterOpen } = useSearch();
  const pathname = usePathname();
  const router = useRouter();

  const hasActiveFilters =
    filters.selectedCategories.length > 0 ||
    filters.selectedAttributes.length > 0;

  // Проверка: находимся на странице продукта
  const isProductPage = pathname.startsWith("/product/");

  return (
    <div className="bg-white px-6 rounded-b-[16px] p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.1)] flex items-center">
      {/* Кнопка назад для страницы продукта */}
      {isProductPage && (
        <Button
          variant="ghost"
          className="mr-2 h-[48px] w-[48px] rounded-full flex items-center justify-center bg-[#f1f1f1] rounded-[50px]"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-10 h-10" />
        </Button>
      )}

      {/* Поле поиска */}
      <div className="relative flex-1 max-w-[314px]">
        <Image
          src="/assets/images/home.svg"
          alt="search"
          className="absolute left-4 top-1/2 -translate-y-1/2"
          width={20}
          height={20}
        />
        <input
          type="search"
          placeholder="Поиск в магазине"
          className="w-full h-[48px] bg-[#f1f1f1] rounded-full pl-12 pr-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Кнопка фильтров */}
      {!isProductPage && (
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="h-[48px] w-[48px] rounded-full flex items-center justify-center relative flex-shrink-0 ml-2"
        >
          <Image
            src="/assets/images/setting-4.svg"
            alt="search"
            width={20}
            height={20}
          />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {filters.selectedCategories.length +
                filters.selectedAttributes.length}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
