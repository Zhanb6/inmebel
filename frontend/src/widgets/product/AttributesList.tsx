import React from "react";
import { Controller } from "react-hook-form";

interface Variant {
  id: number;
  value: string;
}

interface Category {
  id: number;
  name: string;
}

interface Attribute {
  id: number;
  name: string;
  type: string;
  variants: Variant[];
  categories: Category[];
}

interface CategoryItem {
  id: number;
  name: string;
  parent_category_id: number | null;
}

interface Props {
  attributes: Attribute[];
  categories: CategoryItem[];
  control: any;
  setValue: (name: string, value: any) => void;
  watch: (name: string) => any;
}

export const AttributesList: React.FC<Props> = ({
  attributes,
  categories,
  control,
  setValue,
  watch,
}) => {
  const selectedCategories = watch("categories") || [];

  // ---------- 1. ПОСТРОЕНИЕ ДЕРЕВА И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------
  const buildTree = (
    items: CategoryItem[],
    parentId: number | null = null,
  ): any[] => {
    return items
      .filter((item) => item.parent_category_id === parentId)
      .map((item) => {
        const children = buildTree(items, item.id);
        return children.length ? { ...item, children } : { ...item };
      });
  };

  const categoryTree = buildTree(categories);

  // Найти все родительские категории для данной категории
  const getParentCategories = (categoryId: number): number[] => {
    const parents: number[] = [];
    let currentCategory = categories.find((cat) => cat.id === categoryId);

    while (currentCategory && currentCategory.parent_category_id) {
      parents.push(currentCategory.parent_category_id);
      currentCategory = categories.find(
        (cat) => cat.id === currentCategory!.parent_category_id,
      );
    }

    return parents;
  };

  // Найти корневую категорию для данной категории
  const getRootCategory = (categoryId: number): number | null => {
    let currentCategory = categories.find((cat) => cat.id === categoryId);

    while (currentCategory && currentCategory.parent_category_id) {
      currentCategory = categories.find(
        (cat) => cat.id === currentCategory!.parent_category_id,
      );
    }

    return currentCategory ? currentCategory.id : null;
  };

  // Найти все дочерние категории для данной категории
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

  // Проверить, является ли категория корневой
  const isRootCategory = (categoryId: number): boolean => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.parent_category_id === null : false;
  };

  // Получить все выбранные корневые категории
  const getSelectedRootCategories = (): number[] => {
    return selectedCategories.filter((catId: any) =>
      isRootCategory(catId as any),
    );
  };

  // ---------- 2. ОБРАБОТКА ВЫБОРА КАТЕГОРИИ ----------
  const handleCategoryToggle = (categoryId: number, checked: boolean) => {
    if (checked) {
      // Если выбираем категорию
      const rootCategory = getRootCategory(categoryId);

      // Если уже есть выбранные корневые категории и эта категория из другого корня
      const selectedRoots = getSelectedRootCategories();
      if (
        selectedRoots.length > 0 &&
        rootCategory &&
        !selectedRoots.includes(rootCategory)
      ) {
        // Не позволяем выбирать категории из другого корневого раздела
        return;
      }

      // Добавляем саму категорию и всех ее родителей
      const parents = getParentCategories(categoryId);
      const newSelected = [
        ...new Set([...selectedCategories, categoryId, ...parents]),
      ];
      setValue("categories", newSelected);
    } else {
      // Если снимаем выбор с категории
      const children = getAllChildCategories(categoryId);

      // Удаляем саму категорию и всех ее детей
      const newSelected = selectedCategories.filter(
        (id: any) => id !== categoryId && !children.includes(id),
      );

      setValue("categories", newSelected);
    }
  };

  // Проверить, заблокирована ли категория для выбора
  const isCategoryDisabled = (categoryId: number): boolean => {
    const rootCategory = getRootCategory(categoryId);
    const selectedRoots = getSelectedRootCategories();

    // Если есть выбранные корневые категории и эта категория из другого корня
    return (
      selectedRoots.length > 0 &&
      rootCategory !== null &&
      !selectedRoots.includes(rootCategory)
    );
  };

  // ---------- 3. РЕНДЕР ДЕРЕВА ----------
  const renderCategoryTree = (tree: any[], level = 0) => {
    return tree.map((cat) => {
      const isDisabled = isCategoryDisabled(cat.id);

      return (
        <div
          key={cat.id}
          style={{ paddingLeft: `${level * 16}px` }}
          className="py-1"
        >
          <Controller
            name="categories"
            control={control}
            render={({ field }) => {
              const selected: number[] = field.value || [];
              const checked = selected.includes(cat.id);

              const toggle = () => {
                if (!isDisabled) {
                  handleCategoryToggle(cat.id, !checked);
                }
              };

              return (
                <label
                  className={`flex items-center gap-2 ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={toggle}
                    disabled={isDisabled}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{cat.name}</span>
                  {isDisabled && (
                    <span className="text-xs text-gray-500">
                      (выберите категории только из одного раздела)
                    </span>
                  )}
                </label>
              );
            }}
          />

          {cat.children && renderCategoryTree(cat.children, level + 1)}
        </div>
      );
    });
  };

  // ---------- 4. ФИЛЬТРАЦИЯ АТРИБУТОВ ПО ВЫБРАННЫМ КАТЕГОРИЯМ ----------
  const getAttributesForSelectedCategories = () => {
    if (selectedCategories.length === 0) return [];

    return attributes.filter((attr) =>
      attr.categories.some((cat) => selectedCategories.includes(cat.id)),
    );
  };

  const filteredAttributes = getAttributesForSelectedCategories();

  // ---------- 5. RENDER UI ----------
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2">Выберите категории</h2>
      <p className="text-sm text-gray-600 mb-3">
        Можно выбрать категории только из одного корневого раздела
      </p>

      <div className="bg-gray-50 p-4 rounded-md shadow-sm max-h-64 overflow-y-auto">
        {renderCategoryTree(categoryTree)}
      </div>

      {selectedCategories.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6 mb-2">Атрибуты</h2>

          <div className="space-y-4">
            {filteredAttributes.map((attr, index) => (
              <div key={attr.id} className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">{attr.name}</label>
                <Controller
                  name={`attributes.${index}.id`}
                  control={control}
                  defaultValue={attr.id}
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                {attr.type === "integer" && (
                  <Controller
                    name={`attributes.${index}.value`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        placeholder={`Введите значение для ${attr.name}`}
                        className="border p-2 rounded"
                      />
                    )}
                  />
                )}

                {attr.type === "select" && (
                  <Controller
                    name={`attributes.${index}.attribute_variant_ids`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <select
                        multiple
                        value={field.value}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                          ).map((o) => Number(o.value));

                          field.onChange(selectedOptions);
                        }}
                        className="border p-2 rounded"
                      >
                        {attr.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.value}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
