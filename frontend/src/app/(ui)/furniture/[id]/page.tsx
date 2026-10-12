"use client";

import { useOrderId, useOrderUpdate } from "@/features/workshop";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FurnitureAddon,
  FurnitureFilling,
  Order,
  Status,
} from "@/features/workshop/types";
import {
  useFurnitureAdditionUpdate,
  useFurnitureId,
  useFurnitureUpdate,
  useFurnitureUsagePdf,
  useSendCode,
} from "@/features/furniture/hook/useFurniture";
import { tokenStore } from "@/shared";
import Link from "next/link";

interface OrderResponse {
  data: Order;
}

interface MediaFile {
  id: number;
  uuid: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const requestId = parseInt(params.id as string);

  const { data, isPending, isError } = useFurnitureId(requestId) as {
    data: OrderResponse | undefined;
    isPending: boolean;
    isError: boolean;
  };

  const updateOrderMutation = useFurnitureUpdate();
  const updateOrderAdditonMutation = useFurnitureAdditionUpdate();
  const {
    mutate: sendCode,
    data: codeResponse,
    isPending: isCodeLoading,
  } = useSendCode();
  const [open, setOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [code, setCode] = useState("");
  const [additionDialogOpen, setAdditionDialogOpen] = useState(false);
  const [selectedAddition, setSelectedAddition] = useState<number | null>(null);

  // Используем хук для получения PDF
  const {
    data: pdfUrl,
    isPending: isPdfLoading,
    isError: isPdfError,
    refetch: fetchPdf,
  } = useFurnitureUsagePdf(requestId);

  // Получаем токен из tokenStore
  const getAccessToken = (): string | null => {
    try {
      const token = tokenStore.get();
      return token?.access || null;
    } catch (error) {
      console.error("Ошибка при получении токена:", error);
      return null;
    }
  };

  // Функция для скачивания файла с авторизацией
  // Функция для скачивания файла с авторизацией
  const handleDownload = async (media: MediaFile) => {
    try {
      const token = getAccessToken();
      if (!token) {
        toast.error("Требуется авторизация");
        return;
      }

      // Преобразуем http в https если нужно
      let downloadUrl = media.original_url;
      if (downloadUrl.startsWith("http://")) {
        downloadUrl = downloadUrl.replace("http://", "https://");
      }

      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = media.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      toast.success("Файл скачивается");
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      toast.error("Ошибка скачивания файла");
    }
  };
  const handleOpenPdfDialog = async () => {
    setPdfOpen(true);
    if (!pdfUrl) {
      await fetchPdf();
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const shouldIncludeCode =
        orderData?.request_status?.id === 12 ||
        orderData?.request_status?.id === 11 ||
        orderData?.request_status?.id === 1 ||
        orderData?.request_status?.id === 13;

      await updateOrderMutation.mutateAsync({
        requestId,
        code: shouldIncludeCode ? code : undefined,
      });
      setOpen(false);
      setPdfOpen(false);
      setIsConfirmed(false);
      setCode("");
      toast.success("Заявка успешна подтверждена");
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
    }
  };

  const handleUpdateOrderAdditional = async () => {
    try {
      // Проверяем, что selectedAddition установлен
      if (!selectedAddition) {
        toast.error("Дополнение не выбрано");
        return;
      }

      // Проверяем, что orderData существует и есть id
      if (!orderData || !orderData.id) {
        toast.error("Данные заказа не загружены");
        return;
      }

      // Находим конкретное дополнение по ID
      const addition = orderData.additions?.find(
        (add: any) => add.id === selectedAddition,
      );

      if (!addition) {
        toast.error("Дополнение не найдено");
        return;
      }

      // Проверяем, требуется ли код для этого действия
      const needCode = orderData.additions?.some(
        (add: any) => add?.request_addition_status?.id === 1,
      );

      // Если требуется код и он не введен
      if (needCode && !code) {
        toast.error("Введите код подтверждения");
        return;
      }

      // Используем id из проверки выше (уже убедились, что он существует)
      await updateOrderAdditonMutation.mutateAsync(
        {
          requestId: orderData.id, // Теперь это точно number
          idAdditions: addition.id,
          code: needCode ? code : undefined,
        },
        {
          onSuccess: (data) => {
            toast.success("Дополнение успешно обновлено!");
            setAdditionDialogOpen(false);
            setSelectedAddition(null);
            setCode("");
            router.refresh();
          },
          onError: (error) => {
            console.error("Ошибка при обновлении дополнения:", error);
            toast.error("Ошибка при обновлении дополнения");
          },
        },
      );
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
      toast.error("Произошла ошибка");
    }
  };

  // Получаем код из response
  const receivedCode = (codeResponse as any)?.data?.code;

  useEffect(() => {
    if (
      data?.data?.request_status?.id === 12 ||
      data?.data?.request_status?.id === 11 ||
      data?.data?.request_status?.id === 13 ||
      data?.data?.request_status?.id === 1 ||
      data?.data?.additions?.some(
        (addition) => addition?.request_addition_status?.id === 1,
      )
    ) {
      sendCode(requestId);
    }
  }, [data?.data?.request_status?.id, sendCode, requestId]);

  if (isPending) return <div>Загрузка...</div>;
  if (isError) return <div>ОШИБКА</div>;

  const orderData = data?.data;
  if (!orderData) return <div>Данные не найдены</div>;

  const isStatus =
    orderData.request_status?.id === 8 ||
    orderData.request_status?.id === 13 ||
    orderData.request_status?.id === 11 ||
    orderData.request_status?.id === 1 ||
    orderData.request_status?.id === 12;

  // Получаем все медиафайлы из всех статусов
  const allMediaFiles: MediaFile[] = orderData.statuses.data.flatMap(
    (status: Status) => status.media || [],
  );

  // Получаем медиафайлы текущего статуса
  const currentStatusMedia: MediaFile[] =
    orderData.statuses.data.find(
      (status: Status) => status.id === orderData.request_status?.id,
    )?.media || [];

  // Функция для определения типа файла и отображения соответствующего компонента
  const renderMediaFile = (media: MediaFile) => {
    const fileExtension = media.file_name.split(".").pop()?.toLowerCase();
    const mimeType = media.mime_type.toLowerCase();

    if (mimeType.includes("pdf") || fileExtension === "pdf") {
      return (
        <div key={media.id} className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{media.file_name}</h4>
          <iframe
            src={media.original_url}
            className="w-full h-96 border"
            title={media.file_name}
          />
          <button
            onClick={() => handleDownload(media)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
          >
            Скачать PDF
          </button>
        </div>
      );
    } else if (
      mimeType.includes("image") ||
      ["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension || "")
    ) {
      return (
        <div key={media.id} className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{media.file_name}</h4>
          <img
            src={media.original_url}
            alt={media.file_name}
            className="max-w-full h-auto rounded"
          />
          <button
            onClick={() => handleDownload(media)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
          >
            Скачать изображение
          </button>
        </div>
      );
    } else if (
      mimeType.includes("word") ||
      mimeType.includes("document") ||
      fileExtension === "doc" ||
      fileExtension === "docx"
    ) {
      return (
        <div key={media.id} className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{media.file_name}</h4>
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
            <span className="text-gray-500">Документ Word</span>
          </div>
          <button
            onClick={() => handleDownload(media)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
          >
            Скачать документ
          </button>
        </div>
      );
    } else {
      return (
        <div key={media.id} className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{media.file_name}</h4>
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
            <span className="text-gray-500">Файл: {media.file_name}</span>
          </div>
          <button
            onClick={() => handleDownload(media)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
          >
            Скачать файл
          </button>
        </div>
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f7f7f7] px-4">
      {/* Header */}
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

      <div className="w-full grid justify-center items-start mt-3">
        <span className="text-[16px] font-semibold">{orderData.address}</span>
        <span className="text-[14px] text-[#68707e] font-normal mt-1.5">
          Текущий статус: {orderData.request_status?.name}
        </span>
      </div>

      {/* Content */}
      <div className="w-full grid justify-center items-start mt-6 gap-5 mb-20">
        <div className="w-[363px] h-[147px] rounded-[19px] bg-white pt-4 px-5 flex flex-col gap-1">
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

        {/* Данные о мебели */}
        {orderData.furniture_data && (
          <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-2">
              Характеристики мебели
            </h2>

            <div className="text-[14px] text-[#68707e] space-y-2">
              <p>
                <strong>Каркас:</strong> {orderData.furniture_data.frame?.name}
              </p>
              <p>
                <strong>Фасад:</strong> {orderData.furniture_data.facade?.name}
              </p>
              <p>
                <strong>Тип фасада:</strong>{" "}
                {orderData.furniture_data.facade_type?.name}
              </p>
              <p>
                <strong>Цвет фасада:</strong>{" "}
                {orderData.furniture_data.facade_color?.name}
              </p>
              <p>
                <strong>Бренд фурнитуры:</strong>{" "}
                {orderData.furniture_data.brand?.name}
              </p>
              <p>
                <strong>Длина:</strong> {orderData.furniture_data.length} м
              </p>
              <p>
                <strong>Высота:</strong> {orderData.furniture_data.height} м
              </p>
            </div>
          </div>
        )}

        {/* Дополнения */}
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

        {/* Наполнение */}
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

        {/* Медиафайлы текущего статуса */}
        {currentStatusMedia.length > 0 && (
          <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-3">
              Документы текущего статуса ({orderData.request_status?.name})
            </h2>
            <div className="space-y-4">
              {currentStatusMedia.map(renderMediaFile)}
            </div>
          </div>
        )}

        {/* Все медиафайлы */}
        {allMediaFiles.length > 0 && (
          <div className="w-[363px] rounded-[19px] bg-white p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold mb-3">
              Все документы заказа
            </h2>
            <div className="space-y-4">
              {allMediaFiles.map(renderMediaFile)}
            </div>
          </div>
        )}
        {orderData.request_status?.id &&
          [12, 11, 14, 2, 3, 4, 5, 6, 7, 8].includes(
            orderData.request_status.id,
          ) && (
            <Link href={`/client/request/${requestId}`}>
              <Button className="w-[363px] h-[48px] bg-[#85ac8d] hover:bg-[#6d8f74] text-white text-sm font-semibold rounded-[12px]">
                Доп Соглашение
              </Button>
            </Link>
          )}

        <div className="w-[363px] flex flex-col gap-4">
          {/* История статусов */}
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

          {/* Дополнения к заказу */}
          {orderData.additions && orderData.additions.length > 0 && (
            <div className="rounded-[19px] bg-white p-5 flex flex-col">
              <h2 className="text-[16px] font-semibold mb-3">
                Дополнения к заказу ({orderData.additions.length})
              </h2>

              <div className="space-y-4">
                {orderData.additions.map((addition: any) => (
                  <div key={addition.id} className="">
                    {/* Заголовок дополнения */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-[15px] font-medium">
                          Дополнение #{addition.number}
                        </h3>
                        <p className="text-[13px] text-[#68707e] mt-1">
                          Статус: {addition.request_addition_status?.name}
                        </p>
                      </div>
                      <span className="text-[16px] font-semibold text-green-600">
                        {addition.price} тг
                      </span>
                    </div>

                    {/* Характеристики мебели в дополнении */}
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

                        {/* Наполнение */}
                        {addition.furniture_data.filling &&
                          addition.furniture_data.filling.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium">Наполнение:</span>
                              <ul className="list-disc list-inside ml-3">
                                {addition.furniture_data.filling.map(
                                  (fill: any) => (
                                    <li key={fill.id}>
                                      {fill.name} - {fill.count} шт.
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}

                    {/* История статусов дополнения */}
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

                    {/* Кнопка для оформления нового дополнения */}
                    {addition.request_addition_status?.id !== 2 && (
                      <Button
                        className="w-full mt-4 h-10 bg-[#85ac8d] hover:bg-[#6d8f74] text-white text-sm font-semibold rounded-[10px]"
                        onClick={() => {
                          setSelectedAddition(addition.id);
                          setAdditionDialogOpen(true);
                        }}
                        disabled={updateOrderAdditonMutation.isPending}
                      >
                        {updateOrderAdditonMutation.isPending
                          ? "Оформление..."
                          : "Сформировать документ"}
                      </Button>
                    )}
                    <Dialog
                      open={additionDialogOpen}
                      onOpenChange={setAdditionDialogOpen}
                    >
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedAddition
                              ? `Дополнение #${selectedAddition}`
                              : "Оформление дополнения"}
                          </DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-gray-600 mt-2">
                          Вы уверены, что хотите сформировать документ для этого
                          дополнения?
                        </p>

                        {/* Поле для ввода кода */}
                        {orderData?.additions?.some(
                          (addition) =>
                            addition?.request_addition_status?.id === 1,
                        ) && (
                          <div className="mt-4">
                            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
                                  <span className="ml-2 text-red-500">
                                    Не получен
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="grid gap-2">
                              <label
                                htmlFor="addition-code"
                                className="text-sm font-medium"
                              >
                                Введите код подтверждения:
                              </label>
                              <input
                                id="addition-code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Введите код"
                                className="border rounded-md px-3 py-2 text-sm w-full"
                              />
                            </div>
                          </div>
                        )}

                        <DialogFooter className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAdditionDialogOpen(false);
                              setSelectedAddition(null);
                              setCode(""); // Сброс кода при отмене
                            }}
                            className="mr-2"
                          >
                            Отмена
                          </Button>
                          <Button
                            className="bg-[#85ac8d] hover:bg-[#6d8f74]"
                            onClick={() => {
                              handleUpdateOrderAdditional(); // Без параметра
                            }}
                            disabled={updateOrderAdditonMutation.isPending}
                          >
                            {updateOrderAdditonMutation.isPending
                              ? "Оформление..."
                              : "Сформировать"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Показываем кнопку только если статус "Выезд на монтаж" (id: 8) или "Формирование акта выполненных работ" (id: 13) */}
        {isStatus && (
          <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-[363px] h-[48px] bg-[#85ac8d] hover:bg-[#6d8f74] text-white text-sm font-semibold rounded-[12px]"
                onClick={handleOpenPdfDialog}
              >
                {orderData.request_status?.id === 13
                  ? "Ознакомиться с инструкцией"
                  : "Просмотреть документы"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {orderData.request_status?.id === 13
                    ? "Инструкция по использованию мебели"
                    : "Документы заказа"}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 flex flex-col gap-4">
                {/* Для статуса 13 показываем PDF инструкцию */}
                {orderData.request_status?.id === 13 ? (
                  <>
                    {isPdfLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <div>Загрузка PDF...</div>
                      </div>
                    ) : isPdfError ? (
                      <div className="flex justify-center items-center h-64 text-red-500">
                        Ошибка загрузки документа
                      </div>
                    ) : pdfUrl ? (
                      <div className="border rounded-lg overflow-hidden">
                        <iframe
                          src={pdfUrl}
                          className="w-full h-96"
                          title="Инструкция по использованию мебели"
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  /* Для других статусов показываем медиафайлы текущего статуса */
                  <div className="space-y-4">
                    {currentStatusMedia.length > 0 ? (
                      currentStatusMedia.map(renderMediaFile)
                    ) : (
                      <div className="flex justify-center items-center h-32 text-gray-500">
                        Нет документов для текущего статуса
                      </div>
                    )}
                  </div>
                )}

                {/* Чекбокс подтверждения только для статусов, где требуется подтверждение */}
                {(orderData.request_status?.id === 8 ||
                  orderData.request_status?.id === 13 ||
                  orderData?.request_status?.id === 1 ||
                  orderData.request_status?.id === 11 ||
                  orderData.request_status?.id === 12) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirmation"
                      checked={isConfirmed}
                      onCheckedChange={(checked) =>
                        setIsConfirmed(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="confirmation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {orderData.request_status?.id === 13
                        ? "Я ознакомился с инструкцией по использованию мебели"
                        : "Я ознакомился с документами"}
                    </label>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPdfOpen(false);
                    setIsConfirmed(false);
                  }}
                  className="mr-2"
                >
                  Закрыть
                </Button>
                {(orderData.request_status?.id === 8 ||
                  orderData.request_status?.id === 13 ||
                  orderData?.request_status?.id === 1 ||
                  orderData.request_status?.id === 11 ||
                  orderData.request_status?.id === 12) && (
                  <Button
                    className="bg-[#85ac8d] hover:bg-[#6d8f74]"
                    onClick={() => setOpen(true)}
                    disabled={!isConfirmed}
                  >
                    Перейти к подтверждению
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Диалог подтверждения перехода к следующему этапу */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Подтверждение перехода</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-600 mt-2">
              Вы уверены, что хотите перейти к следующему этапу выполнения
              заказа?
            </p>
            {/* Отображение кода для статусов 12 и 13 */}
            {(orderData.request_status?.id === 12 ||
              orderData.request_status?.id === 11 ||
              orderData?.request_status?.id === 1 ||
              orderData.request_status?.id === 13) && (
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
            {(orderData?.request_status?.id === 12 ||
              orderData?.request_status?.id === 11 ||
              orderData?.request_status?.id === 1 ||
              orderData?.request_status?.id === 13) && (
              <div className="grid gap-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Код:
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Введите код"
                  className="border rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                Отмена
              </Button>
              <Button
                className="bg-[#85ac8d] hover:bg-[#6d8f74]"
                onClick={handleUpdateOrder}
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending
                  ? "Обновление..."
                  : "Перейти к следующему этапу"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
