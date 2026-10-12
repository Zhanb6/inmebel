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
import { Button } from "../ui/button";
import { Loader2, User } from "lucide-react";

const clientSchema = z.object({
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
});

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const ClientModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading,
}: ClientModalProps) => {
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      iin: "",
      address: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        iin: initialData.iin || "",
        address: initialData.address || "",
      });
    } else {
      form.reset({
        iin: "",
        address: "",
      });
    }
  }, [initialData, isOpen, form]);

  const handleSubmit = async (values: z.infer<typeof clientSchema>) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {initialData ? "Редактирование клиента" : "Создание клиента"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="iin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ИИН *</FormLabel>
                  <FormControl>
                    <Input placeholder="9249941661" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="073518, Липецкая область, город Истра, въезд Ломоносова, 67"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
