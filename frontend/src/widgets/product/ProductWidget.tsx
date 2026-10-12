import {
  fillDictionaries,
  TCreateProductSchema,
  useCreateProduct,
  useCreateProductSchema,
} from "@/features/product";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabeledInput, LoadingSVG } from "@/shared/components";
import { Button } from "@/shared/components/ui";
import { useEffect, useState } from "react";
import { ImageUpload } from "@/shared/components/form/ImageUpload";
import { AttributesList } from "./AttributesList";
import { toast } from "react-toastify";

export function ProductWidget() {
  const schema = useCreateProductSchema();
  const createMutation = useCreateProduct();

  const [attributes, setAttributes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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
    reset,
  } = useForm<TCreateProductSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      images: [],
      categories: [],
      attributes: [],
    },
  });

  // Обновляем атрибуты при загрузке данных
  useEffect(() => {
    if (attributes.length > 0) {
      setValue(
        "attributes",
        attributes.map((attr) => ({
          id: attr.id,
          value: "",
          attribute_variant_ids: [],
        })),
      );
    }
  }, [attributes, setValue]);

  async function onSubmit(payload: TCreateProductSchema) {
    try {
      console.log("Submitting payload:", payload); // Добавьте для отладки

      const formData = new FormData();

      formData.append("name", payload.name);
      formData.append("description", payload.description);
      formData.append("price", String(payload.price));

      // Добавляем изображения
      payload.images?.forEach((file: File) => {
        formData.append("images[]", file);
      });

      // Добавляем категории
      payload.categories?.forEach((catId: number) =>
        formData.append("categories[]", catId.toString()),
      );

      // Добавляем атрибуты (только те, у которых есть значения)
      payload.attributes?.forEach((attr, index) => {
        if (
          attr.value ||
          (attr.attribute_variant_ids && attr.attribute_variant_ids.length > 0)
        ) {
          formData.append(`attributes[${index}][id]`, String(attr.id));

          if (attr.value) {
            formData.append(`attributes[${index}][value]`, attr.value);
          }

          if (
            attr.attribute_variant_ids &&
            attr.attribute_variant_ids.length > 0
          ) {
            attr.attribute_variant_ids.forEach((v, i) =>
              formData.append(
                `attributes[${index}][attribute_variant_ids][${i}]`,
                String(v),
              ),
            );
          }
        }
      });

      await createMutation.mutateAsync(
        { formData },
        {
          onSuccess: () => {
            toast.success("Продукт успешно добавлен");
            // Сбрасываем форму после успешного создания
            reset();
          },
          onError: (error) => {
            toast.error("Ошибка при создании продукта");
            console.error("Ошибка при создании продукта:", error);
          },
        },
      );
    } catch (error) {
      console.error("Ошибка при создании продукта:", error);
      toast.error("Ошибка при создании продукта");
    }
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

        <ImageUpload
          name="images"
          control={control}
          setValue={setValue as any}
          error={errors.images?.message?.toString()}
          label="Выберите изображения"
        />

        {/* Отображаем атрибуты только если есть категории и атрибуты */}
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
          disabled={isSubmitting || createMutation.isPending}
        >
          {(isSubmitting || createMutation.isPending) && <LoadingSVG />}
          <span>Создать Продукт</span>
        </Button>
      </div>
    </form>
  );
}
