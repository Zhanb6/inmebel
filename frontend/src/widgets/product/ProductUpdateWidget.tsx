import {
  fillDictionaries,
  TCreateProductSchema,
  useCreateProductSchema,
  useShowProductQuery,
  useUpdateProduct,
} from "@/features/product";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabeledInput, LoadingSVG } from "@/shared/components";
import { Button } from "@/shared/components/ui";
import { useEffect, useState, useRef } from "react";
import { AttributesList } from "./AttributesList";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { ImageUploadDelete } from "@/shared/components/form/ImageUploadDelete";

export function ProductUpdateWidget() {
  const schema = useCreateProductSchema();
  const params = useParams();
  const requestId = parseInt(params.id as string);
  const updateMutation = useUpdateProduct();
  const product = useShowProductQuery(requestId);

  const [attributes, setAttributes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const initialImagesRef = useRef<string[]>([]);

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        const dicts = await fillDictionaries();
        setCategories(dicts.categories);
        setAttributes(dicts.attributes);
      } catch (err) {
        console.error(err);
      }
    };
    loadDictionaries();
  }, []);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
  } = useForm<TCreateProductSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      images: [],
      categories: [],
      attributes: attributes.map((attr) => ({
        id: attr.id,
        value: "",
        attribute_variant_ids: [],
      })),
    },
  });

  async function onSubmit(payload: TCreateProductSchema) {
    try {
      const formData = new FormData();

      formData.append("name", payload.name);
      formData.append("description", payload.description);
      formData.append("price", String(payload.price));

      // Проверяем, есть ли новые изображения (File объекты)
      const hasNewImages = payload.images?.some(
        (file: any) => file instanceof File,
      );

      // Отправляем images[] только если есть новые изображения
      if (hasNewImages) {
        payload.images?.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("images[]", file);
          }
        });
      }

      payload.categories?.forEach((catId: number) =>
        formData.append("categories[]", catId.toString()),
      );

      payload.attributes?.forEach((attr, index) => {
        formData.append(`attributes[${index}][id]`, String(attr.id));

        if (attr.value) {
          formData.append(`attributes[${index}][value]`, attr.value);
        }

        attr.attribute_variant_ids?.forEach((v, i) =>
          formData.append(
            `attributes[${index}][attribute_variant_ids][${i}]`,
            String(v),
          ),
        );
      });

      await updateMutation.mutateAsync(
        { productId: requestId, formData },
        {
          onSuccess: () => {
            toast.success("Продукт успешно обновлен");
            // Обновляем reference изображений после успешного обновления
            if (payload.images) {
              initialImagesRef.current = payload.images.map((img: any) =>
                typeof img === "string" ? img : URL.createObjectURL(img),
              );
            }
          },
        },
      );
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
    }
  }

  useEffect(() => {
    if (product.data && attributes.length > 0) {
      setValue("name", product.data.data.name || "");
      setValue("description", product.data.data.description || "");
      setValue("price", product.data.data.price?.toString() || "");
      setValue(
        "categories",
        product.data.data.categories?.map((cat) => cat.id) || [],
      );

      // Обработка изображений - сохраняем как URL строки
      if (product.data.data.media && product.data.data.media.length > 0) {
        const imageUrls = product.data.data.media.map(
          (media) => media.original_url,
        );
        setValue("images", imageUrls);
        initialImagesRef.current = imageUrls; // сохраняем исходные изображения
      }

      // Заполнение атрибутов
      const productAttributes =
        product.data.data.attributes?.map((attr) => ({
          id: attr.attribute_id,
          value: attr.value || "",
          attribute_variant_ids: attr.variants?.map((v) => v.id) || [],
        })) || [];

      setValue("attributes", productAttributes);
    }
  }, [product.data, attributes, setValue]);

  // Убираем дублирующий useEffect для инициализации
  useEffect(() => {
    const initializeForm = async () => {
      if (product.data && attributes.length > 0) {
        setValue("name", product.data.data.name || "");
        setValue("description", product.data.data.description || "");
        setValue("price", product.data.data.price?.toString() || "");
        setValue(
          "categories",
          product.data.data.categories?.map((cat) => cat.id) || [],
        );

        // Заполнение атрибутов
        const productAttributes =
          product.data.data.attributes?.map((attr) => ({
            id: attr.attribute_id,
            value: attr.value || "",
            attribute_variant_ids: attr.variants?.map((v) => v.id) || [],
          })) || [];

        setValue("attributes", productAttributes);
      }
    };

    initializeForm();
  }, [product.data, attributes, setValue]);

  if (product.isLoading) {
    return <div>Загрузка продукта...</div>;
  }

  if (!product.data?.data) {
    return <div>Продукт не найден</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="size-full flex flex-col items-center gap-2">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <LabeledInput
              label="Укажите название"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <LabeledInput
              label="Укажите Описание"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <LabeledInput
              label="Укажите цену"
              type="number"
              min={0}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.price?.message}
            />
          )}
        />

        <ImageUploadDelete
          name="images"
          control={control}
          setValue={setValue as any}
          error={errors.images?.message?.toString()}
          label="Выберите изображения"
          productId={requestId}
        />

        {attributes.length > 0 && categories.length > 0 && (
          <AttributesList
            attributes={attributes}
            categories={categories}
            control={control}
            setValue={setValue as any}
            watch={watch}
          />
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-button rounded-full mt-8 mb-16"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoadingSVG />}
          <span>Обновить Продукт</span>
        </Button>
      </div>
    </form>
  );
}
