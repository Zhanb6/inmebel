"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/shared/components/ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useSearch } from "./SearchContext";
import { fillDictionaries } from "@/features/product";

export default function FilterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { filters, updateFilters, clearFilters } = useSearch();

  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
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

    if (isOpen) {
      loadDictionaries();
    }
  }, [isOpen]);

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

  const categoryTree = buildCategoryTree(categories);

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
      const newCategories = [
        ...filters.selectedCategories,
        categoryId,
        ...children,
      ];
      updateFilters({ selectedCategories: newCategories });
    } else {
      // При снятии выбора убираем категорию и всех ее детей
      const children = getAllChildCategories(categoryId);
      const newCategories = filters.selectedCategories.filter(
        (id) => id !== categoryId && !children.includes(id),
      );
      updateFilters({ selectedCategories: newCategories });
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
              checked={filters.selectedCategories.includes(category.id)}
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
    const existingIndex = filters.selectedAttributes.findIndex(
      (attr) => attr.id === attributeId,
    );

    let newAttributes;
    if (existingIndex >= 0) {
      // Обновляем существующий атрибут
      newAttributes = [...filters.selectedAttributes];
      if (type === "select") {
        newAttributes[existingIndex] = {
          id: attributeId,
          attribute_variant_ids: value,
        };
      } else {
        newAttributes[existingIndex] = {
          id: attributeId,
          value: value,
        };
      }
    } else {
      // Добавляем новый атрибут
      if (type === "select") {
        newAttributes = [
          ...filters.selectedAttributes,
          { id: attributeId, attribute_variant_ids: value },
        ];
      } else {
        newAttributes = [
          ...filters.selectedAttributes,
          { id: attributeId, value: value },
        ];
      }
    }

    updateFilters({ selectedAttributes: newAttributes });
  };

  const handleApplyFilters = () => {
    onClose();
  };

  const handleClearAll = () => {
    clearFilters();
  };

  // Получение атрибутов для выбранных категорий
  const getAttributesForSelectedCategories = () => {
    if (filters.selectedCategories.length === 0) return [];

    return attributes.filter((attr) =>
      attr.categories.some((cat: any) =>
        filters.selectedCategories.includes(cat.id),
      ),
    );
  };

  const filteredAttributes = getAttributesForSelectedCategories();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Фильтры</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
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
                <p className="text-gray-500 text-sm">Загрузка категорий...</p>
              )}
            </div>
          </div>

          {/* Фильтр по атрибутам */}
          {filteredAttributes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Атрибуты</h3>
              <div className="space-y-3">
                {filteredAttributes.map((attr) => {
                  const currentAttr = filters.selectedAttributes.find(
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
                            currentAttr?.attribute_variant_ids || ([] as any)
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
                            <option key={variant.id} value={variant.id as any}>
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
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C]"
          >
            Применить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
