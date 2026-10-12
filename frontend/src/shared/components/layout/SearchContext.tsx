"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface FilterState {
  selectedCategories: number[];
  selectedAttributes: {
    id?: number;
    value?: string;
    attribute_variant_ids?: number[];
  }[];
}

interface SearchContextType {
  search: string;
  setSearch: (search: string) => void;
  debouncedSearch: string;
  resetPage: boolean;
  setResetPage: (reset: boolean) => void;
  // Фильтры
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilters: (updates: Partial<FilterState>) => void;
  clearFilters: () => void;
  // Состояние модального окна
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [resetPage, setResetPage] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedAttributes: [],
  });

  // Debounce поиска 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setResetPage(true);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setResetPage(true); // Сбрасываем страницу при изменении фильтров
  };

  const clearFilters = () => {
    setFilters({
      selectedCategories: [],
      selectedAttributes: [],
    });
    setResetPage(true);
  };

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        debouncedSearch,
        resetPage,
        setResetPage,
        filters,
        setFilters,
        updateFilters,
        clearFilters,
        isFilterOpen,
        setIsFilterOpen,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
