import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useAttributes } from "@/features/categories/hooks/useCategories";
import { useClientCreate } from "@/features/categories/hooks/useCategories";
import { useAttributeCreate } from "@/features/categories/hooks/useCategories";
import { useAttributeUpdate } from "@/features/categories/hooks/useCategories";
import { useAttributeDelete } from "@/features/categories/hooks/useCategories";
import UsersSkeleton from "@/shared/components/block/users-skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useCategoryDelete } from "@/features/categories/hooks/useCategories";

import {
  Folder,
  FolderTree,
  Hash,
  Search,
  Layers,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  ChevronDown,
  Tag,
  Ruler,
  List,
  Type,
  CheckSquare,
  Palette,
} from "lucide-react";
import { CategoryModal } from "@/shared/components/modals/CategoryModal";
import { DeleteModal } from "@/shared/components/modals/DeleteModal";
import { AttributeModal } from "@/shared/components/modals/AttributeModal";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] =
    useState(false);
  const [isDeleteAttributeModalOpen, setIsDeleteAttributeModalOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategories({
    search: debouncedSearch,
  });
  const {
    data: attributesData,
    isLoading: attributesLoading,
    isError: attributesError,
    refetch: refetchAttributes,
  } = useAttributes();
  const { mutate: createCategory, isPending: isCreating } = useClientCreate();
  const { mutate: createAttribute, isPending: isCreatingAttribute } =
    useAttributeCreate();
  const { mutate: updateAttribute, isPending: isUpdatingAttribute } =
    useAttributeUpdate();
  const { mutate: deleteAttribute, isPending: isDeletingAttribute } =
    useAttributeDelete();
  const { mutate: deleteCategory, isPending: isDeleting } = useCategoryDelete();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCreateCategory = async (categoryData: any) => {
    createCategory(categoryData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetchCategories();
      },
      onError: (error) => {
        console.error("Ошибка создания категории:", error);
      },
    });
  };

  const handleCreateAttribute = async (attributeData: any) => {
    createAttribute(attributeData, {
      onSuccess: () => {
        setIsAttributeModalOpen(false);
        refetchAttributes();
      },
      onError: (error) => {
        console.error("Ошибка создания атрибута:", error);
      },
    });
  };

  const handleUpdateAttribute = async (attributeData: any) => {
    if (selectedAttribute) {
      updateAttribute(
        { id: selectedAttribute.id, payload: attributeData },
        {
          onSuccess: () => {
            setIsEditAttributeModalOpen(false);
            setSelectedAttribute(null);
            refetchAttributes();
          },
          onError: (error) => {
            console.error("Ошибка обновления атрибута:", error);
          },
        }
      );
    }
  };

  const handleDeleteAttribute = async () => {
    if (selectedAttribute) {
      deleteAttribute(selectedAttribute.id, {
        onSuccess: () => {
          setIsDeleteAttributeModalOpen(false);
          setSelectedAttribute(null);
          refetchAttributes();
        },
        onError: (error) => {
          console.error("Ошибка удаления атрибута:", error);
        },
      });
    }
  };

  const handleEditAttribute = (attribute: any) => {
    setSelectedAttribute(attribute);
    setIsEditAttributeModalOpen(true);
  };

  const handleDeleteAttributeClick = (attribute: any) => {
    setSelectedAttribute(attribute);
    setIsDeleteAttributeModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
          refetchCategories();
        },
        onError: (error) => {
          console.error("Ошибка удаления категории:", error);
        },
      });
    }
  };

  const handleOpenDeleteModal = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  if (categoriesLoading || attributesLoading) return <UsersSkeleton />;

  if (categoriesError || attributesError) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg mt-4 border border-red-200">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-700">Ошибка загрузки</h3>
        <p className="text-red-600">
          Не удалось загрузить данные. Пожалуйста, попробуйте еще раз.
        </p>
      </div>
    );
  }

  const categories: any = (categoriesData as any)?.data || [];
  const attributes: any = (attributesData as any)?.data || [];

  const CategoriesTab = () => {
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const parentCategories = categories.filter(
      (cat: any) => !cat.parent_category_id
    );
    const childCategories = categories.filter(
      (cat: any) => cat.parent_category_id
    );

    const getChildCategories = (parentId: number) => {
      return childCategories.filter(
        (cat: any) => cat.parent_category_id === parentId
      );
    };

    const toggleCategoryExpansion = (categoryId: number) => {
      setExpandedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    };

    const CategoryItem = ({
      category,
      level = 0,
    }: {
      category: any;
      level?: number;
    }) => {
      const children = getChildCategories(category.id);
      const isExpanded = expandedCategories.includes(category.id);
      const hasChildren = children.length > 0;

      return (
        <div
          className={`mb-2 ${
            level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""
          }`}
        >
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              level === 0 ? "bg-white" : "bg-white"
            } hover:bg-gray-100 border border-gray-200`}
          >
            <div className="flex items-center gap-3">
              {hasChildren && (
                <button
                  onClick={() => toggleCategoryExpansion(category.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}

              <Folder
                className={`w-5 h-5 ${
                  level === 0 ? "text-blue-600" : "text-gray-500"
                }`}
              />

              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-medium ${
                      level === 0 ? "text-gray-800" : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="font-mono bg-white hover:bg-gray-100 border-gray-300 text-gray-700 text-xs"
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {category.id}
                  </Badge>
                  {level === 0 && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">
                      Родительская
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {hasChildren
                    ? `${children.length} подкатегорий`
                    : "Нет подкатегорий"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link to={`/categories/${category.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenDeleteModal(category)}
                className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div className="mt-2">
              {children.map((child: any) => (
                <CategoryItem
                  key={child.id}
                  category={child}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по названию категории..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<FolderTree className="w-8 h-8 text-blue-600" />}
            label="Всего категорий"
            value={categories.length}
            color="blue"
          />
          <StatCard
            icon={<Folder className="w-8 h-8 text-green-600" />}
            label="Родительские"
            value={parentCategories.length}
            color="green"
          />
          <StatCard
            icon={<Layers className="w-8 h-8 text-purple-600" />}
            label="Подкатегории"
            value={childCategories.length}
            color="purple"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Структура категорий
          </h2>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              {parentCategories.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p>Нет категорий</p>
                </div>
              ) : (
                parentCategories.map((category: any) => (
                  <CategoryItem key={category.id} category={category} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const AttributesTab = () => {
    const integerAttributes = attributes.filter(
      (attr: any) => attr.type === "integer"
    );
    const selectAttributes = attributes.filter(
      (attr: any) => attr.type === "select"
    );
    const textAttributes = attributes.filter(
      (attr: any) => attr.type === "text"
    );
    const booleanAttributes = attributes.filter(
      (attr: any) => attr.type === "boolean"
    );

    const AttributeCard = ({ attribute }: { attribute: any }) => {
      const getAttributeIcon = (type: string) => {
        switch (type) {
          case "integer":
            return <Ruler className="w-5 h-5 text-blue-600" />;
          case "select":
            return <List className="w-5 h-5 text-purple-600" />;
          case "text":
            return <Type className="w-5 h-5 text-green-600" />;
          case "boolean":
            return <CheckSquare className="w-5 h-5 text-amber-600" />;
          default:
            return <Tag className="w-5 h-5 text-gray-600" />;
        }
      };

      const getAttributeTypeLabel = (type: string) => {
        switch (type) {
          case "integer":
            return "Число";
          case "select":
            return "Выбор из вариантов";
          case "text":
            return "Текст";
          case "boolean":
            return "Да/Нет";
          default:
            return type;
        }
      };

      return (
        <Card className="border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getAttributeIcon(attribute.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">
                      {attribute.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {getAttributeTypeLabel(attribute.type)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      ID: {attribute.id}
                    </Badge>
                  </div>

                  {attribute.categories.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Категории:</p>
                      <div className="flex flex-wrap gap-1">
                        {attribute.categories.map((cat: any) => (
                          <Link key={cat.id} to={`/categories/${cat.id}`}>
                            <Badge
                              variant="secondary"
                              className="text-xs hover:bg-gray-200 cursor-pointer"
                            >
                              {cat.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {attribute.type === "select" &&
                    attribute.variants.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Варианты:</p>
                        <div className="flex flex-wrap gap-1">
                          {attribute.variants.map((variant: any) => (
                            <Badge
                              key={variant.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {variant.value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                  onClick={() => handleEditAttribute(attribute)}
                  title="Редактировать атрибут"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                  onClick={() => handleDeleteAttributeClick(attribute)}
                  title="Удалить атрибут"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Атрибуты</h2>
            <p className="text-gray-500">Характеристики для товаров</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Tag className="w-6 h-6 text-blue-600" />}
            label="Всего атрибутов"
            value={attributes.length}
            color="blue"
          />
          <StatCard
            icon={<Ruler className="w-6 h-6 text-green-600" />}
            label="Числовые"
            value={integerAttributes.length}
            color="green"
          />
          <StatCard
            icon={<List className="w-6 h-6 text-purple-600" />}
            label="С вариантами"
            value={selectAttributes.length}
            color="purple"
          />
          <StatCard
            icon={<Type className="w-6 h-6 text-amber-600" />}
            label="Текстовые"
            value={textAttributes.length + booleanAttributes.length}
            color="amber"
          />
        </div>

        {/* Числовые атрибуты */}
        {integerAttributes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Числовые атрибуты</h3>
              <Badge>{integerAttributes.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integerAttributes.map((attr: any) => (
                <AttributeCard key={attr.id} attribute={attr} />
              ))}
            </div>
          </div>
        )}

        {/* Атрибуты с вариантами */}
        {selectAttributes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-800">Атрибуты с вариантами</h3>
              <Badge>{selectAttributes.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectAttributes.map((attr: any) => (
                <AttributeCard key={attr.id} attribute={attr} />
              ))}
            </div>
          </div>
        )}

        {/* Другие типы атрибутов */}
        {(textAttributes.length > 0 || booleanAttributes.length > 0) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-800">Другие атрибуты</h3>
              <Badge>{textAttributes.length + booleanAttributes.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {textAttributes.map((attr: any) => (
                <AttributeCard key={attr.id} attribute={attr} />
              ))}
              {booleanAttributes.map((attr: any) => (
                <AttributeCard key={attr.id} attribute={attr} />
              ))}
            </div>
          </div>
        )}

        {attributes.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-white border-gray-200">
            <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">
              Нет атрибутов
            </h3>
            <p className="text-gray-500">Создайте первый атрибут для товаров</p>
            <Button
              className="mt-4"
              onClick={() => setIsAttributeModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать атрибут
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 rounded-lg mt-4">
      <CategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Создание категории"
        categories={categories}
        onSubmit={handleCreateCategory}
        isLoading={isCreating}
      />

      <AttributeModal
        isOpen={isAttributeModalOpen}
        onClose={() => setIsAttributeModalOpen(false)}
        title="Создание атрибута"
        onSubmit={handleCreateAttribute}
        isLoading={isCreatingAttribute}
      />

      <AttributeModal
        isOpen={isEditAttributeModalOpen}
        onClose={() => {
          setIsEditAttributeModalOpen(false);
          setSelectedAttribute(null);
        }}
        title="Редактирование атрибута"
        initialData={selectedAttribute}
        onSubmit={handleUpdateAttribute}
        isLoading={isUpdatingAttribute}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Удаление категории"
        description="Вы уверены, что хотите удалить эту категорию? Все подкатегории также будут удалены."
        isLoading={isDeleting}
        itemName={selectedCategory?.name}
      />

      <DeleteModal
        isOpen={isDeleteAttributeModalOpen}
        onClose={() => {
          setIsDeleteAttributeModalOpen(false);
          setSelectedAttribute(null);
        }}
        onConfirm={handleDeleteAttribute}
        title="Удаление атрибута"
        description={`Вы уверены, что хотите удалить атрибут "${selectedAttribute?.name}"? Это действие нельзя отменить.`}
        isLoading={isDeletingAttribute}
        itemName={selectedAttribute?.name}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Категории и атрибуты
          </h1>
          <p className="text-gray-500 mt-1">Управление структурой товаров</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (activeTab === "categories") setIsCreateModalOpen(true);
              if (activeTab === "attributes") setIsAttributeModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "categories"
              ? "Добавить категорию"
              : "Добавить атрибут"}
          </Button>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2"
              >
                <Folder className="w-4 h-4" />
                Категории
                {categories.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {categories.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="attributes"
                className="flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Атрибуты
                {attributes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {attributes.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories">
              <CategoriesTab />
            </TabsContent>

            <TabsContent value="attributes">
              <AttributesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const StatCard = ({ icon, label, value, color }: any) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
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
