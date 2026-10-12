// features/profiles/components/edit-profile-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  useUpdateWorkshopMutation,
  useWorkshopInfoQuery,
} from "@/features/profiles";

// Схема валидации с использованием Zod
const workshopSchema = z.object({
  // Основная информация
  name: z.string().min(1, "Название мастерской обязательно"),
  description: z.string().optional(),
  address: z.string().min(1, "Адрес обязателен"),
  city: z.string().min(1, "Город обязателен"),
  director_name: z.string().min(1, "Имя директора обязательно"),

  // Реквизиты
  iin: z.string().min(1, "ИИН обязателен"),
  bic: z.string().min(1, "БИК обязателен"),
  bank: z.string().min(1, "Название банка обязательно"),
  iic: z.string().min(1, "ИИК обязателен"),
  bc: z.string().min(1, "БИН обязателен"),
});

type WorkshopFormData = z.infer<typeof workshopSchema>;

export function EditProfileModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Получаем данные мастерской
  const { data: workshopData, isLoading, isError } = useWorkshopInfoQuery();

  // Хук для обновления мастерской
  const updateMutation = useUpdateWorkshopMutation();

  // Инициализация React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      director_name: "",
      iin: "",
      bic: "",
      bank: "",
      iic: "",
      bc: "",
    },
  });

  // Заполняем форму данными из запроса при открытии модалки
  useEffect(() => {
    if (isOpen && workshopData?.data) {
      const data = workshopData.data;

      reset({
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        city: data.city || "",
        director_name: data.director_name || "",
        iin: data.iin || "",
        bic: data.bic || "",
        bank: data.bank || "",
        iic: data.iic || "",
        bc: data.bc || "",
      });
    }
  }, [isOpen, workshopData, reset]);

  const onSubmit = async (data: WorkshopFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success("Профиль мастерской успешно обновлен");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Ошибка при обновлении профиля");
    }
  };

  // Если данные еще загружаются или произошла ошибка
  if (isLoading && !workshopData) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <Edit2 className="h-4 w-4" />
        Загрузка...
      </Button>
    );
  }

  if (isError) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 text-red-500">
        <Edit2 className="h-4 w-4" />
        Ошибка загрузки
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Edit2 className="h-4 w-4" />
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование профиля мастерской</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Основная информация */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Название мастерской *
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Введите название мастерской"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="director_name" className="text-sm font-medium">
                  Имя директора *
                </label>
                <Input
                  id="director_name"
                  {...register("director_name")}
                  placeholder="Введите имя директора"
                  className={errors.director_name ? "border-red-500" : ""}
                />
                {errors.director_name && (
                  <p className="text-sm text-red-500">
                    {errors.director_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Город *
                </label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Введите город"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Адрес *
                </label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Введите адрес"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label htmlFor="description" className="text-sm font-medium">
                Описание мастерской
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Введите описание мастерской"
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Реквизиты */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Реквизиты мастерской</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="iin" className="text-sm font-medium">
                  ИИН *
                </label>
                <Input
                  id="iin"
                  {...register("iin")}
                  placeholder="Введите ИИН"
                  className={errors.iin ? "border-red-500" : ""}
                />
                {errors.iin && (
                  <p className="text-sm text-red-500">{errors.iin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="bic" className="text-sm font-medium">
                  БИК *
                </label>
                <Input
                  id="bic"
                  {...register("bic")}
                  placeholder="Введите БИК"
                  className={errors.bic ? "border-red-500" : ""}
                />
                {errors.bic && (
                  <p className="text-sm text-red-500">{errors.bic.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="bank" className="text-sm font-medium">
                  Банк *
                </label>
                <Input
                  id="bank"
                  {...register("bank")}
                  placeholder="Введите название банка"
                  className={errors.bank ? "border-red-500" : ""}
                />
                {errors.bank && (
                  <p className="text-sm text-red-500">{errors.bank.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="iic" className="text-sm font-medium">
                  ИИК *
                </label>
                <Input
                  id="iic"
                  {...register("iic")}
                  placeholder="Введите ИИК"
                  className={errors.iic ? "border-red-500" : ""}
                />
                {errors.iic && (
                  <p className="text-sm text-red-500">{errors.iic.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="bc" className="text-sm font-medium">
                  БИН *
                </label>
                <Input
                  id="bc"
                  {...register("bc")}
                  placeholder="Введите БИН"
                  className={errors.bc ? "border-red-500" : ""}
                />
                {errors.bc && (
                  <p className="text-sm text-red-500">{errors.bc.message}</p>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * Поля, отмеченные звездочкой, обязательны для заполнения
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updateMutation.isPending}
              className="bg-[#58AB41] hover:bg-[#4a9a36]"
            >
              {isSubmitting || updateMutation.isPending
                ? "Сохранение..."
                : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
