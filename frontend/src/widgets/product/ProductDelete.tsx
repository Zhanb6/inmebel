import { ArrowLeft, Edit, X } from "lucide-react";
import { useDeleteProduct } from "@/features/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from "@/shared/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function ProductDelete() {
  const router = useRouter();
  const params = useParams();
  const requestId = parseInt(params.id as string);

  const { data: session } = useSession();
  const userRole = (session as any)?.loginOut?.role;

  const deleteProduct = useDeleteProduct();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteProduct.mutate(requestId, {
      onSuccess: () => router.push("/product"),
    });
  };

  return (
    <>
      <div className="">
        {/* ❗ Показывать крестик только если workshop */}
        {userRole === "workshop" && (
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center bg-[#FFFAF7] rounded-full w-[32px] h-[32px]"
            >
              <X size={20} strokeWidth={2.2} />
            </button>
            <button
              onClick={() => router.push(`/product/update/${requestId}`)}
              className="flex items-center justify-center bg-[#F0F0F0] rounded-full w-[32px] h-[32px]"
            >
              <Edit size={20} strokeWidth={2.2} />
            </button>
          </div>
        )}
      </div>

      {/* ДИАЛОГ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-5 shadow-xl">
            <DialogHeader>
              <DialogTitle>Удалить товар?</DialogTitle>
              <DialogDescription>
                Действие необратимо. Подтвердите удаление товара.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-3 justify-center mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Отмена
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white"
              >
                Удалить
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
