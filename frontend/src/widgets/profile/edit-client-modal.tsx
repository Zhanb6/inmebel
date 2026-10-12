// features/client/components/edit-client-modal.tsx
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
import { Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  useClientInfoQuery,
  useUpdateClientInfoMutation,
} from "@/features/profiles";

// Схема валидации с использованием Zod
const clientInfoSchema = z.object({
  address: z.string().optional(),
  iin: z.string().optional(),
});

type ClientInfoFormData = z.infer<typeof clientInfoSchema>;

export function EditClientInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Получаем данные клиента
  const { data: clientData, isLoading, isError } = useClientInfoQuery();

  // Хук для обновления информации о клиенте
  const updateMutation = useUpdateClientInfoMutation();

  // Инициализация React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientInfoFormData>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: {
      address: "",
      iin: "",
    },
  });

  // Заполняем форму данными из запроса при открытии модалки
  useEffect(() => {
    if (isOpen && clientData) {
      // Проверяем структуру данных
      const responseData = clientData as any;

      // Вариант 1: если данные в responseData.data.data
      if (responseData?.data?.data) {
        const innerData = responseData.data.data;
        reset({
          address: innerData.address || "",
          iin: innerData.iin || "",
        });
      }
      // Вариант 2: если данные в responseData.data
      else if (responseData?.data) {
        const innerData = responseData.data;
        reset({
          address: innerData.address || "",
          iin: innerData.iin || "",
        });
      }
      // Вариант 3: если данные напрямую
      else {
        reset({
          address: responseData.address || "",
          iin: responseData.iin || "",
        });
      }
    }
  }, [isOpen, clientData, reset]);

  const onSubmit = async (data: ClientInfoFormData) => {
    try {
      // Убираем пустые строки перед отправкой
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== ""),
      );

      await updateMutation.mutateAsync(cleanedData);
      toast.success("Информация о клиенте успешно обновлена");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Ошибка при обновлении информации");
    }
  };

  // Если данные еще загружаются или произошла ошибка
  if (isLoading) {
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
          Редактировать профиль
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование профиля клиента</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Адрес
              </label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Введите адрес"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="iin" className="text-sm font-medium">
                ИИН
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
