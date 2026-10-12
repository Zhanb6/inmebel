"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Loader2, Tag, Plus, X } from "lucide-react";

const attributeSchema = z.object({
  name: z.string().min(2, {
    message: "Название должно быть не менее 2 символов",
  }),
  type: z.enum(["text", "integer", "boolean", "select"], {
    message: "Выберите тип атрибута",
  }),
  variants: z
    .array(
      z.object({
        value: z.string().min(1, "Значение варианта обязательно"),
      })
    )
    .optional(),
});

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const AttributeModal = ({
  isOpen,
  onClose,
  title,
  initialData,
  onSubmit,
  isLoading,
}: AttributeModalProps) => {
  const [variantInputs, setVariantInputs] = useState<string[]>([]);

  const form = useForm<z.infer<typeof attributeSchema>>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: "",
      type: "integer",
      variants: [],
    },
  });

  const attributeType = form.watch("type");

  useEffect(() => {
    if (initialData) {
      const variants =
        initialData.variants?.map((v: any) => ({ value: v.value })) || [];
      form.reset({
        name: initialData.name || "",
        type: initialData.type || "integer",
        variants: variants,
      });
      setVariantInputs(variants.map((v: any) => v.value));
    } else {
      form.reset({
        name: "",
        type: "integer",
        variants: [],
      });
      setVariantInputs([]);
    }
  }, [initialData, isOpen, form]);

  const addVariantInput = () => {
    setVariantInputs([...variantInputs, ""]);
  };

  const removeVariantInput = (index: number) => {
    const newInputs = variantInputs.filter((_, i) => i !== index);
    setVariantInputs(newInputs);

    const currentVariants = form.getValues("variants") || [];
    const updatedVariants = currentVariants.filter((_, i) => i !== index);
    form.setValue("variants", updatedVariants);
  };

  const updateVariantValue = (index: number, value: string) => {
    const newInputs = [...variantInputs];
    newInputs[index] = value;
    setVariantInputs(newInputs);

    const currentVariants = form.getValues("variants") || [];
    if (!currentVariants[index]) {
      currentVariants[index] = { value };
    } else {
      currentVariants[index].value = value;
    }
    form.setValue("variants", currentVariants);
  };

  const handleSubmit = async (values: z.infer<typeof attributeSchema>) => {
    const filteredVariants =
      values.variants?.filter((v) => v.value.trim() !== "") || [];

    const submitData = {
      ...values,
      variants: attributeType === "select" ? filteredVariants : [],
    };

    await onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название атрибута *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Длина, Высота, Материал..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип атрибута *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="integer">Число (integer)</SelectItem>
                      <SelectItem value="text">Текст (text)</SelectItem>
                      <SelectItem value="boolean">Да/Нет (boolean)</SelectItem>
                      <SelectItem value="select">
                        Выбор из вариантов (select)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {attributeType === "select" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Варианты выбора</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariantInput}
                    className="h-8"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить вариант
                  </Button>
                </div>

                <div className="space-y-2">
                  {variantInputs.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={value}
                        onChange={(e) =>
                          updateVariantValue(index, e.target.value)
                        }
                        placeholder={`Вариант ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariantInput(index)}
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {variantInputs.length === 0 && (
                    <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-sm text-gray-500">
                        Добавьте варианты для выбора
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
