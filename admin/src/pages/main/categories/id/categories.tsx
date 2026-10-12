import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

import { useCategoryId } from "@/features/categories/hooks/useCategories";
import { useCategoryUpdate } from "@/features/categories/hooks/useCategories";
import { useCategoryDelete } from "@/features/categories/hooks/useCategories";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useAttributesList } from "@/features/categories/hooks/useCategories";
import { useAttributeCreate } from "@/features/categories/hooks/useCategories";
import { useAttributeUpdate } from "@/features/categories/hooks/useCategories";
import { useAttributeDelete } from "@/features/categories/hooks/useCategories"; // Добавляем
import { useAttributeAttach } from "@/features/categories/hooks/useCategories";
import { useVariantCreate } from "@/features/categories/hooks/useCategories";
import { useVariantUpdate } from "@/features/categories/hooks/useCategories";
import { useVariantDelete } from "@/features/categories/hooks/useCategories";

import {
  Folder,
  Hash,
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  Layers,
  CheckSquare,
  Ruler,
  Palette,
  Type,
  ChevronRight,
  FolderTree,
  AlertCircle,
  Tag,
  List,
  X,
  Link as LinkIcon,
  Pencil,
} from "lucide-react";
import { CategoryModal } from "@/shared/components/modals/CategoryModal";
import { DeleteModal } from "@/shared/components/modals/DeleteModal";
import { AttributeModal } from "@/shared/components/modals/AttributeModal";
import { VariantModal } from "@/shared/components/modals/VariantModal";

export default function CategoryId() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isEditAttributeModalOpen, setIsEditAttributeModalOpen] =
    useState(false);
  const [isDeleteAttributeModalOpen, setIsDeleteAttributeModalOpen] =
    useState(false); // Новое состояние
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const {
    data: categoryData,
    isLoading,
    isError,
    refetch: refetchCategory,
  } = useCategoryId(Number(id));
  const { data: categoriesData } = useCategories();
  const { data: attributesData } = useAttributesList();
  const { mutate: updateCategory, isPending: isUpdating } = useCategoryUpdate();
  const { mutate: deleteCategory, isPending: isDeleting } = useCategoryDelete();
  const { mutate: createAttribute, isPending: isCreatingAttribute } =
    useAttributeCreate();
  const { mutate: updateAttribute, isPending: isUpdatingAttribute } =
    useAttributeUpdate();
  const { mutate: deleteAttribute, isPending: isDeletingAttribute } =
    useAttributeDelete(); // Добавляем
  const { mutate: attachAttribute, isPending: isAttachingAttribute } =
    useAttributeAttach();
  const { mutate: createVariant, isPending: isCreatingVariant } =
    useVariantCreate();
  const { mutate: updateVariant, isPending: isUpdatingVariant } =
    useVariantUpdate();
  const { mutate: deleteVariant } = useVariantDelete();

  const handleUpdateCategory = async (categoryData: any) => {
    updateCategory(
      { id: Number(id), payload: categoryData },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          refetchCategory();
        },
        onError: (error) => {
          console.error("Ошибка обновления категории:", error);
        },
      }
    );
  };

  const handleDeleteCategory = async () => {
    deleteCategory(Number(id), {
      onSuccess: () => {
        navigate("/categories");
      },
      onError: (error) => {
        console.error("Ошибка удаления категории:", error);
      },
    });
  };

  const handleCreateAttribute = async (attributeData: any) => {
    createAttribute(attributeData, {
      onSuccess: () => {
        setIsAttributeModalOpen(false);
        refetchCategory();
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
            refetchCategory();
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
          refetchCategory();
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

  // Функция для привязки существующего атрибута к категории
  const handleAttachAttribute = async (attributeId: number) => {
    attachAttribute(
      {
        id: Number(id),
        attributeId,
        payload: {},
      },
      {
        onSuccess: () => {
          refetchCategory();
        },
        onError: (error) => {
          console.error("Ошибка привязки атрибута:", error);
        },
      }
    );
  };

  const handleAddVariant = (attribute: any) => {
    setSelectedAttribute(attribute);
    setSelectedVariant(null);
    setIsVariantModalOpen(true);
  };

  const handleEditVariant = (attribute: any, variant: any) => {
    setSelectedAttribute(attribute);
    setSelectedVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleDeleteVariant = (attribute: any, variantId: number) => {
    if (window.confirm("Удалить этот вариант?")) {
      deleteVariant(
        { id: attribute.id, variantId, payload: {} },
        {
          onSuccess: () => {
            refetchCategory();
          },
          onError: (error) => {
            console.error("Ошибка удаления варианта:", error);
          },
        }
      );
    }
  };

  const handleCreateVariant = async (variantData: any) => {
    if (selectedAttribute) {
      createVariant(
        { id: selectedAttribute.id, payload: variantData },
        {
          onSuccess: () => {
            setIsVariantModalOpen(false);
            setSelectedAttribute(null);
            refetchCategory();
          },
          onError: (error) => {
            console.error("Ошибка создания варианта:", error);
          },
        }
      );
    }
  };

  const handleUpdateVariant = async (variantData: any) => {
    if (selectedAttribute && selectedVariant) {
      updateVariant(
        {
          id: selectedAttribute.id,
          variantId: selectedVariant.id,
          payload: variantData,
        },
        {
          onSuccess: () => {
            setIsVariantModalOpen(false);
            setSelectedAttribute(null);
            setSelectedVariant(null);
            refetchCategory();
          },
          onError: (error) => {
            console.error("Ошибка обновления варианта:", error);
          },
        }
      );
    }
  };

  if (isLoading)
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg mt-4 border border-red-200">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-700">Ошибка загрузки</h3>
        <p className="text-red-600">
          Не удалось загрузить категорию. Пожалуйста, попробуйте еще раз.
        </p>
      </div>
    );

  const category: any = (categoryData as any)?.data;
  if (!category) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50 mt-4 border-gray-200">
        <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">
          Категория не найдена
        </h3>
        <p className="text-gray-500">Категория с ID {id} не существует</p>
        <Button className="mt-4" onClick={() => navigate("/categories")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const categories: any = (categoriesData as any)?.data || [];
  const attributes: any[] = category.categories || [];
  const allAttributes: any[] = (attributesData as any)?.data || [];

  const integerAttributes = attributes.filter(
    (attr: any) => attr.type === "integer"
  );
  const selectAttributes = attributes.filter(
    (attr: any) => attr.type === "select"
  );
  const textAttributes = attributes.filter((attr: any) => attr.type === "text");
  const booleanAttributes = attributes.filter(
    (attr: any) => attr.type === "boolean"
  );

  const availableAttributes = allAttributes.filter(
    (attr: any) => !attributes.some((a: any) => a.id === attr.id)
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Модальные окна */}
      <CategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактирование категории"
        initialData={category}
        categories={categories.filter((cat: any) => cat.id !== category.id)}
        onSubmit={handleUpdateCategory}
        isLoading={isUpdating}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Удаление категории"
        description={`Вы уверены, что хотите удалить категорию "${category.name}"? Все связанные данные будут удалены.`}
        isLoading={isDeleting}
        itemName={category.name}
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

      <AttributeModal
        isOpen={isAttributeModalOpen}
        onClose={() => setIsAttributeModalOpen(false)}
        title="Добавление атрибута"
        onSubmit={handleCreateAttribute}
        isLoading={isCreatingAttribute}
      />

      {/* Модальное окно для редактирования атрибута */}
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

      <VariantModal
        isOpen={isVariantModalOpen}
        onClose={() => {
          setIsVariantModalOpen(false);
          setSelectedAttribute(null);
          setSelectedVariant(null);
        }}
        title={
          selectedVariant ? "Редактирование варианта" : "Добавление варианта"
        }
        initialData={selectedVariant}
        onSubmit={selectedVariant ? handleUpdateVariant : handleCreateVariant}
        isLoading={isCreatingVariant || isUpdatingVariant}
      />

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/categories")}
          className="flex items-center gap-1 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к категориям
        </Button>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-700">{category.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Folder className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {category.name}
                      </h1>
                      <Badge
                        variant="outline"
                        className="font-mono bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700"
                      >
                        <Hash className="w-3 h-3 mr-1" />#{category.id}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {category.parent_category_id ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FolderTree className="w-4 h-4" />
                          <span>Подкатегория</span>
                          <ChevronRight className="w-4 h-4" />
                          <Link
                            to={`/categories/${category.parent_category_id}`}
                          >
                            <Badge
                              variant="outline"
                              className="bg-white hover:bg-gray-50 cursor-pointer"
                            >
                              Родительская категория #
                              {category.parent_category_id}
                            </Badge>
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <Folder className="w-4 h-4" />
                          <span className="font-medium">
                            Родительская категория
                          </span>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Атрибутов: {attributes.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Табы для атрибутов */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Атрибуты категории
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Характеристики товаров в этой категории
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setIsAttributeModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Добавить атрибут
                  </Button>
                </div>
              </div>

              {/* Числовые атрибуты */}
              {integerAttributes.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-700">
                      Числовые атрибуты
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {integerAttributes.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {integerAttributes.map((attr: any) => (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-50 rounded">
                            <Type className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {attr.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Числовой параметр
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700"
                          >
                            ID: {attr.id}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => handleEditAttribute(attr)}
                              title="Редактировать атрибут"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                              onClick={() => handleDeleteAttributeClick(attr)}
                              title="Удалить атрибут"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Атрибуты с вариантами */}
              {selectAttributes.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-gray-700">
                      Атрибуты с вариантами
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800">
                      {selectAttributes.length}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {selectAttributes.map((attr: any) => (
                      <div
                        key={attr.id}
                        className="p-4 bg-white rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-purple-50 rounded">
                              <Layers className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {attr.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Выбор из вариантов
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700"
                            >
                              ID: {attr.id}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                                onClick={() => handleEditAttribute(attr)}
                                title="Редактировать атрибут"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                                onClick={() => handleDeleteAttributeClick(attr)}
                                title="Удалить атрибут"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddVariant(attr)}
                                className="h-8 w-8 p-0"
                                title="Добавить вариант"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {attr.variants?.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500">
                              Варианты:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {attr.variants.map((variant: any) => (
                                <div
                                  key={variant.id}
                                  className="relative group flex items-center"
                                >
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700 flex items-center gap-1 pr-10"
                                  >
                                    <CheckSquare className="w-3 h-3" />
                                    {variant.value}
                                  </Badge>
                                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 hover:bg-blue-50"
                                      onClick={() =>
                                        handleEditVariant(attr, variant)
                                      }
                                      title="Редактировать вариант"
                                    >
                                      <Pencil className="w-3 h-3 text-blue-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 hover:bg-red-50"
                                      onClick={() =>
                                        handleDeleteVariant(attr, variant.id)
                                      }
                                      title="Удалить вариант"
                                    >
                                      <X className="w-3 h-3 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Текстовые атрибуты */}
              {textAttributes.length > 0 && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-gray-700">
                      Текстовые атрибуты
                    </h3>
                    <Badge className="bg-green-100 text-green-800">
                      {textAttributes.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {textAttributes.map((attr: any) => (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-green-50 rounded">
                            <Type className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {attr.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Текстовый параметр
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700"
                          >
                            ID: {attr.id}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => handleEditAttribute(attr)}
                              title="Редактировать атрибут"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                              onClick={() => handleDeleteAttributeClick(attr)}
                              title="Удалить атрибут"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Булевые атрибуты */}
              {booleanAttributes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-amber-600" />
                    <h3 className="font-medium text-gray-700">
                      Булевые атрибуты
                    </h3>
                    <Badge className="bg-amber-100 text-amber-800">
                      {booleanAttributes.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {booleanAttributes.map((attr: any) => (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-amber-50 rounded">
                            <CheckSquare className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {attr.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Да/Нет параметр
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700"
                          >
                            ID: {attr.id}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => handleEditAttribute(attr)}
                              title="Редактировать атрибут"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                              onClick={() => handleDeleteAttributeClick(attr)}
                              title="Удалить атрибут"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {attributes.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                  <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Атрибуты не настроены
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Добавьте атрибуты для товаров этой категории
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
                      onClick={() => setIsAttributeModalOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Создать новый атрибут
                    </Button>
                    {availableAttributes.length > 0 && (
                      <Button
                        variant="outline"
                        className="px-4 py-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          if (availableAttributes[0]) {
                            handleAttachAttribute(availableAttributes[0].id);
                          }
                        }}
                        disabled={isAttachingAttribute}
                      >
                        <LinkIcon className="w-4 h-4" />
                        Привязать существующий
                        {isAttachingAttribute && "..."}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Статистика</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">Товаров в категории</div>
                  <div className="font-bold text-gray-800">0</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">Подкатегорий</div>
                  <div className="font-bold text-gray-800">0</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">Всего атрибутов</div>
                  <div className="font-bold text-gray-800">
                    {attributes.length}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">Вариантов</div>
                  <div className="font-bold text-gray-800">
                    {selectAttributes.reduce(
                      (acc: number, attr: any) =>
                        acc + (attr.variants?.length || 0),
                      0
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Действия</h3>
              <div className="space-y-2">
                <Button
                  className="w-full px-4 py-3 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
                  onClick={() => setIsAttributeModalOpen(true)}
                >
                  <Tag className="w-4 h-4" />
                  <span>Добавить атрибут</span>
                </Button>

                <Button
                  className="w-full px-4 py-3 text-left text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-3"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Удалить категорию</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Доступные атрибуты */}
          {availableAttributes.length > 0 && (
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Доступные атрибуты
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Вы можете привязать эти атрибуты к категории:
                </p>
                <div className="space-y-2">
                  {availableAttributes.slice(0, 5).map((attr: any) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {attr.type === "integer" && (
                          <Ruler className="w-4 h-4 text-blue-500" />
                        )}
                        {attr.type === "select" && (
                          <List className="w-4 h-4 text-purple-500" />
                        )}
                        {attr.type === "text" && (
                          <Type className="w-4 h-4 text-green-500" />
                        )}
                        {attr.type === "boolean" && (
                          <CheckSquare className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-sm">{attr.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {attr.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-green-50"
                          onClick={() => handleAttachAttribute(attr.id)}
                          disabled={isAttachingAttribute}
                          title="Привязать атрибут"
                        >
                          <LinkIcon className="w-3 h-3 text-green-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {availableAttributes.length > 5 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-gray-500">
                        и еще {availableAttributes.length - 5} атрибутов
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {category.parent_category_id && (
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Родительская категория
                </h3>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-800">
                        ID: {category.parent_category_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Название неизвестно
                      </div>
                    </div>
                  </div>
                  <Link to={`/categories/${category.parent_category_id}`}>
                    <Button className="w-full mt-3 px-3 py-1.5 text-sm text-blue-600 bg-white border border-blue-300 rounded hover:bg-blue-50">
                      Перейти к родителю
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
