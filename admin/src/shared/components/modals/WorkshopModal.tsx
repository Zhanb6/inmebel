import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Building } from "lucide-react";

const workshopSchema = z.object({
  name: z.string().min(2, {
    message: "Название должно быть не менее 2 символов",
  }),
  iin: z
    .string()
    .min(12, {
      message: "ИИН должен содержать 12 символов",
    })
    .max(12, {
      message: "ИИН должен содержать 12 символов",
    }),
  address: z.string().min(5, {
    message: "Адрес должен содержать не менее 5 символов",
  }),
  description: z.string().min(10, {
    message: "Описание должно содержать не менее 10 символов",
  }),
  bic: z.string().min(8, {
    message: "БИК должен содержать не менее 8 символов",
  }),
  bank: z.string().min(2, {
    message: "Название банка должно содержать не менее 2 символов",
  }),
  director_name: z.string().min(2, {
    message: "Имя директора должно содержать не менее 2 символов",
  }),
  iic: z.string().min(15, {
    message: "ИИК должен содержать не менее 15 символов",
  }),
  bc: z.string().min(1, {
    message: "БИН должен содержать не менее 1 символа",
  }),
  city: z.string().min(2, {
    message: "Город должен содержать не менее 2 символов",
  }),
});

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const WorkshopModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading,
}: WorkshopModalProps) => {
  const form = useForm<z.infer<typeof workshopSchema>>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: "",
      iin: "",
      address: "",
      description: "",
      bic: "",
      bank: "",
      director_name: "",
      iic: "",
      bc: "",
      city: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        iin: initialData.iin || "",
        address: initialData.address || "",
        description: initialData.description || "",
        bic: initialData.bic || "",
        bank: initialData.bank || "",
        director_name: initialData.director_name || "",
        iic: initialData.iic || "",
        bc: initialData.bc || "",
        city: initialData.city || "",
      });
    } else {
      form.reset({
        name: "",
        iin: "",
        address: "",
        description: "",
        bic: "",
        bank: "",
        director_name: "",
        iic: "",
        bc: "",
        city: "",
      });
    }
  }, [initialData, isOpen, form]);

  const handleSubmit = async (values: z.infer<typeof workshopSchema>) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {initialData ? "Редактирование мастерской" : "Создание мастерской"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название компании *</FormLabel>
                    <FormControl>
                      <Input placeholder="ИП «IN MEBEL»" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ИИН *</FormLabel>
                    <FormControl>
                      <Input placeholder="910501451133" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="РК, г.Астана ул. А 91, 12/441"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание деятельности мастерской..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>БИК *</FormLabel>
                    <FormControl>
                      <Input placeholder="CASPKZKA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Банк *</FormLabel>
                    <FormControl>
                      <Input placeholder="АҚ/АО «Kaspi Bank»" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="director_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Директор *</FormLabel>
                    <FormControl>
                      <Input placeholder="Бейсембаева С.А." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ИИК *</FormLabel>
                    <FormControl>
                      <Input placeholder="KZ24722S000039145797" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>БИН *</FormLabel>
                    <FormControl>
                      <Input placeholder="17" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Город *</FormLabel>
                    <FormControl>
                      <Input placeholder="г. Астана" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
