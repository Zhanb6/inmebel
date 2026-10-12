"use client";

import {
  useOrderId,
  useOrderUpdate,
  useSendCode,
  useWorkShopAdditionUpdate,
} from "@/features/workshop";
import { Checkbox } from "@/shared/components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  FurnitureAddon,
  FurnitureFilling,
  Media,
  Order,
  Status,
} from "@/features/workshop/types";

interface OrderResponse {
  data: Order;
}

interface FormData {
  comment?: string;
  files?: FileList;
  price?: number;
  code?: string;
  date_start?: string;
  date_end?: string;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const requestId = parseInt(params.id as string);

  const { data, isPending, isError } = useOrderId(requestId) as {
    data: OrderResponse | undefined;
    isPending: boolean;
    isError: boolean;
  };

  const updateOrderMutation = useOrderUpdate();
  const updateAdditionMutation = useWorkShopAdditionUpdate();

  const {
    mutate: sendCode,
    data: codeResponse,
    isPending: isCodeLoading,
    isError: isCodeError,
    isSuccess: isCodeSuccess,
  } = useSendCode();

  const [open, setOpen] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [additionDialogOpen, setAdditionDialogOpen] = useState(false);
  const [selectedAddition, setSelectedAddition] = useState<number | null>(null);
  const [additionCode, setAdditionCode] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const files = watch("files");

  const handleUpdateOrder = async (formData: any) => {
    try {
      const submitFormData = new FormData();

      if (formData.comment?.trim()) {
        submitFormData.append("comment", formData.comment.trim());
      }

      if (formData.price?.trim()) {
        submitFormData.append("price", formData.price.trim());
      }

      if (formData.code?.trim()) {
        submitFormData.append("code", formData.code.trim());
      }

      if (formData.date_start) {
        const dateStart = new Date(formData.date_start);
        submitFormData.append(
          "date_start",
          dateStart.toISOString().split("T")[0],
        );
      }

      if (formData.date_end) {
        const dateEnd = new Date(formData.date_end);
        submitFormData.append("date_end", dateEnd.toISOString().split("T")[0]);
      }

      if (formData.files && formData.files.length > 0) {
        Array.from(formData.files).forEach((file: any) => {
          submitFormData.append("files[]", file);
        });
      }

      const result = await updateOrderMutation.mutateAsync({
        requestId,
        formData: submitFormData,
      });

      setOpen(false);
      reset();
      setHasSentCode(false);
      toast.success("Заявка успешно перешла к следующему этапу");
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
      toast.error("Ошибка при переходе к следующему этапу");
    }
  };

  const onDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      reset();
      setHasSentCode(false);
    }
  };

  const handleConfirmAddition = async () => {
    try {
      if (!selectedAddition) {
        toast.error("Дополнение не выбрано");
        return;
      }

      // Проверяем, что orderData существует и имеет id
      if (!orderData || !orderData.id) {
        toast.error("Данные заказа не загружены");
        return;
      }

      const addition = orderData.additions?.find(
        (add: any) => add.id === selectedAddition,
      );

      if (!addition) {
        toast.error("Дополнение не найдено");
        return;
      }

      if (addition.request_addition_status?.id === 2) {
        if (!additionCode) {
          toast.error("Введите код подтверждения");
          return;
        }

        await updateAdditionMutation.mutateAsync(
          {
            requestId: orderData.id, // Без optional chaining, так как уже проверили выше
            idAdditions: addition.id,
            code: additionCode,
          },
          {
            onSuccess: () => {
              toast.success("Подпись цеха успешно подтверждена!");
              setAdditionDialogOpen(false);
              setSelectedAddition(null);
              setAdditionCode("");
              router.refresh();
            },
            onError: (error: any) => {
              console.error("Ошибка при подтверждении дополнения:", error);
              toast.error(
                error?.response?.data?.message ||
                  "Ошибка при подтверждении подписи цеха",
              );
            },
          },
        );
      } else {
        toast.error("Невозможно подтвердить дополнение в текущем статусе");
      }
    } catch (error) {
      console.error("Ошибка при подтверждении дополнения:", error);
      toast.error("Произошла ошибка при подтверждении");
    }
  };

  const receivedCode = (codeResponse as any)?.data?.code;

  useEffect(() => {
    const shouldSendCode =
      data?.data?.request_status?.id === 3 ||
      data?.data?.request_status?.id === 8 ||
      data?.data?.request_status?.id === 12 ||
      data?.data?.request_status?.id === 1 ||
      data?.data?.additions?.some(
        (addition: any) => addition?.request_addition_status?.id === 2,
      );

    if (shouldSendCode && !hasSentCode) {
      sendCode(requestId);
      setHasSentCode(true);
    }
  }, [
    data?.data?.request_status?.id,
    data?.data?.additions,
    sendCode,
    requestId,
    hasSentCode,
  ]);

  if (isPending) return <div>Загрузка...</div>;
  if (isError) return <div>ОШИБКА</div>;

  const orderData = data?.data;
  if (!orderData) return <div>Данные не найдены</div>;

  const isStatus3or8 =
    orderData.request_status?.id === 3 ||
    orderData.request_status?.id === 12 ||
    orderData.request_status?.id === 8 ||
    orderData.request_status?.id === 1;

  const hasAdditionsToSign = orderData.additions?.some(
    (addition: any) => addition.request_addition_status?.id === 2,
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f7f7f7] px-4">
      <div className="flex items-center justify-between w-full px-4 py-3">
        <button
          onClick={() => router.back()}
          className="text-gray-700 text-2xl leading-none"
        >
          ←
        </button>
        <h1 className="font-semibold text-[20px] text-gray-900">
          Заказ №{orderData.id}
        </h1>
        <div>Х</div>
      </div>

      <div className="w-full grid justify-center items-start mt-6 gap-5 mb-20">
        <div className="w-[363px] h-[147px] rounded-[19px] bg-white pt-4 px-5 flex flex-col gap-4">
          <span className="text-[16px] font-semibold max-w-[225px]">
            {orderData.furniture_type?.name}
          </span>
          <span className="text-[14px] text-[#68707e] font-normal">
            {orderData.created_at
              ? new Date(orderData.created_at).toLocaleString("ru-RU")
              : ""}
          </span>
          <span className="text-[20px] font-semibold">
            {orderData.price} тг
          </span>
        </div>

        {orderData.furniture_data && (
          <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-2">
              Характеристики мебели
            </h2>

            <div className="text-[14px] text-[#68707e] space-y-2">
              {orderData.furniture_data.frame?.name && (
                <p>
                  <strong>Каркас:</strong> {orderData.furniture_data.frame.name}
                </p>
              )}
              {orderData.furniture_data.facade?.name && (
                <p>
                  <strong>Фасад:</strong> {orderData.furniture_data.facade.name}
                </p>
              )}
              {orderData.furniture_data.facade_type?.media?.original_url && (
                <div className="flex items-center gap-3">
                  <strong>Тип фасада:</strong>
                  <img
                    src={
                      orderData.furniture_data.facade_type.media.original_url
                    }
                    alt={orderData.furniture_data.facade_type.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                </div>
              )}
              {orderData.furniture_data.facade_color?.media?.original_url && (
                <div className="flex items-center gap-3">
                  <strong>Цвет фасада:</strong>
                  <img
                    src={
                      orderData.furniture_data.facade_color.media.original_url
                    }
                    alt={orderData.furniture_data.facade_color.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                </div>
              )}
              {orderData.furniture_data.brand?.name && (
                <p>
                  <strong>Бренд фурнитуры:</strong>{" "}
                  {orderData.furniture_data.brand.name}
                </p>
              )}
              {orderData.furniture_data.length && (
                <p>
                  <strong>Длина:</strong> {orderData.furniture_data.length} м
                </p>
              )}
              {orderData.furniture_data.height && (
                <p>
                  <strong>Высота:</strong> {orderData.furniture_data.height} м
                </p>
              )}
            </div>
          </div>
        )}

        {orderData.furniture_data?.addons &&
          orderData.furniture_data.addons.length > 0 && (
            <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
              <h2 className="text-[16px] font-semibold mb-2">Дополнения</h2>
              <ul className="list-disc list-inside text-[14px] text-[#68707e]">
                {orderData.furniture_data.addons.map(
                  (addon: FurnitureAddon) => (
                    <li key={addon.id}>
                      {addon.furniture_addon} - {addon.count} шт. (
                      {addon.length} м)
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

        {orderData.furniture_data?.filling &&
          orderData.furniture_data.filling.length > 0 && (
            <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
              <h2 className="text-[16px] font-semibold mb-2">Наполнение</h2>
              <ul className="list-disc list-inside text-[14px] text-[#68707e]">
                {orderData.furniture_data.filling.map(
                  (fill: FurnitureFilling) => (
                    <li key={fill.id}>
                      {fill.name} - {fill.count} шт.
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

        {orderData.additions && orderData.additions.length > 0 && (
          <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-3">
              Дополнения к заказу ({orderData.additions.length})
            </h2>

            <div className="space-y-4">
              {orderData.additions.map((addition: any) => (
                <div key={addition.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-[15px] font-medium">
                        Дополнение #{addition.number}
                      </h3>
                      <p className="text-[13px] text-[#68707e] mt-1">
                        Статус: {addition.request_addition_status?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Создано:{" "}
                        {new Date(addition.created_at).toLocaleString("ru-RU")}
                      </p>
                    </div>
                    <span className="text-[16px] font-semibold text-green-600">
                      {addition.price} тг
                    </span>
                  </div>

                  {addition.furniture_data && (
                    <div className="space-y-2 text-[14px] text-[#68707e]">
                      <p>
                        <span className="font-medium">Тип:</span>{" "}
                        {addition.furniture_type?.name}
                      </p>
                      <p>
                        <span className="font-medium">Каркас:</span>{" "}
                        {addition.furniture_data.frame?.name}
                      </p>
                      <p>
                        <span className="font-medium">Фасад:</span>{" "}
                        {addition.furniture_data.facade?.name}
                      </p>
                      <p>
                        <span className="font-medium">Цвет:</span>{" "}
                        {addition.furniture_data.facade_color?.name}
                      </p>
                      <p>
                        <span className="font-medium">Бренд:</span>{" "}
                        {addition.furniture_data.brand?.name}
                      </p>
                    </div>
                  )}

                  {addition.statuses?.data && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-[14px] font-medium mb-2">
                        История статусов дополнения
                      </h4>
                      <ul className="flex flex-col gap-2 text-[13px] text-[#68707e]">
                        {addition.statuses.data.map((status: any) => (
                          <li
                            key={status.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox checked={!!status.passed_at} disabled />
                            <span
                              className={
                                status.passed_at ? "text-green-600" : ""
                              }
                            >
                              {status.name}
                              {status.passed_at && (
                                <span className="text-xs text-gray-500 ml-2">
                                  (
                                  {new Date(status.passed_at).toLocaleString(
                                    "ru-RU",
                                  )}
                                  )
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {addition.request_addition_status?.id === 2 && (
                    <Button
                      className="w-full mt-4 h-10 bg-[#85ac8d] hover:bg-[#6d8f74] text-white text-sm font-semibold rounded-[10px]"
                      onClick={() => {
                        setSelectedAddition(addition.id);
                        setAdditionDialogOpen(true);
                      }}
                      disabled={updateAdditionMutation.isPending}
                    >
                      {updateAdditionMutation.isPending &&
                      selectedAddition === addition.id
                        ? "Обработка..."
                        : "Подпись цеха"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-[363px] flex flex-col gap-4">
          <div className="rounded-[19px] bg-white p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-3">История статусов</h2>

            <ul className="flex flex-col gap-2 text-[14px] text-[#68707e]">
              {orderData.statuses.data.map((status: Status) => (
                <li key={status.id} className="flex items-center gap-2">
                  <Checkbox checked={!!status.passed_at} disabled />
                  <span className={status.passed_at ? "text-green-600" : ""}>
                    {status.name}
                    {status.passed_at && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({new Date(status.passed_at).toLocaleString("ru-RU")})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Dialog open={additionDialogOpen} onOpenChange={setAdditionDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {selectedAddition
                  ? `Подпись цеха - Дополнение #${selectedAddition}`
                  : "Подпись цеха"}
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-600 mt-2">
              Вы уверены, что хотите подтвердить подпись цеха для этого
              дополнения?
            </p>

            {(isCodeSuccess || hasAdditionsToSign) && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-[14px] font-semibold text-yellow-800">
                  Код для подтверждения:
                  {isCodeLoading ? (
                    <span className="ml-2 text-gray-500">Загрузка...</span>
                  ) : receivedCode ? (
                    <span className="ml-2 text-green-600 font-mono">
                      {receivedCode}
                    </span>
                  ) : (
                    <span className="ml-2 text-red-500">Не получен</span>
                  )}
                </span>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <Label htmlFor="addition-code">Введите код подтверждения:</Label>
              <Input
                id="addition-code"
                type="text"
                value={additionCode}
                onChange={(e) => setAdditionCode(e.target.value)}
                placeholder="Введите код"
                className="w-full"
                disabled={updateAdditionMutation.isPending}
              />
              {updateAdditionMutation.isError && (
                <p className="text-sm text-red-500">
                  {updateAdditionMutation.error?.message ||
                    "Ошибка при подтверждении"}
                </p>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAdditionDialogOpen(false);
                  setSelectedAddition(null);
                  setAdditionCode("");
                }}
                className="mr-2"
                disabled={updateAdditionMutation.isPending}
              >
                Отмена
              </Button>
              <Button
                className="bg-[#85ac8d] hover:bg-[#6d8f74]"
                onClick={handleConfirmAddition}
                disabled={updateAdditionMutation.isPending}
              >
                {updateAdditionMutation.isPending
                  ? "Подтверждение..."
                  : "Подтвердить подпись"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={open} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="w-[363px] h-[48px] bg-[#85ac8d] hover:bg-[#6d8f74] text-white text-sm font-semibold rounded-[12px]"
              disabled={!orderData.statuses.next_status?.can}
            >
              Перейти к следующему этапу
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Переход к следующему этапу</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(handleUpdateOrder)}
              className="space-y-4"
            >
              {isStatus3or8 && (
                <div className="space-y-4">
                  {isCodeLoading && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      Отправка кода...
                    </div>
                  )}

                  {isCodeError && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      Ошибка при отправке кода
                    </div>
                  )}

                  {isCodeSuccess && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-[14px] font-semibold text-yellow-800">
                        Код для подтверждения:
                        {isCodeLoading ? (
                          <span className="ml-2 text-gray-500">
                            Загрузка...
                          </span>
                        ) : receivedCode ? (
                          <span className="ml-2 text-green-600 font-mono">
                            {receivedCode}
                          </span>
                        ) : (
                          <span className="ml-2 text-red-500">Не получен</span>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (обязательно)</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register("price", {
                        required: isStatus3or8 ? "Цена обязательна" : false,
                      })}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Код (обязательно)</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Введите код для подтверждения"
                      {...register("code")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_start">Дата начала</Label>
                    <Input
                      id="date_start"
                      type="date"
                      {...register("date_start")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_end">Дата окончания</Label>
                    <Input
                      id="date_end"
                      type="date"
                      {...register("date_end")}
                    />
                  </div>
                </div>
              )}

              {!isStatus3or8 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Переход к следующему этапу заказа
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий (необязательно)</Label>
                <textarea
                  id="comment"
                  {...register("comment")}
                  className="w-full min-h-[80px] p-2 border border-gray-300 rounded-md resize-y"
                  placeholder="Введите комментарий к этапу..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Файлы (необязательно)</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  {...register("files")}
                />
                {files && files.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Выбрано файлов: {files.length}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="mr-2"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="bg-[#85ac8d] hover:bg-[#6d8f74]"
                  disabled={
                    updateOrderMutation.isPending ||
                    (isStatus3or8 && isCodeLoading)
                  }
                >
                  {updateOrderMutation.isPending
                    ? "Обновление..."
                    : "Перейти к следующему этапу"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
