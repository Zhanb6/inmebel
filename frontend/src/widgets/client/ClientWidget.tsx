"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type TClientRequestSchema,
  useClientRequesMutation,
  useClientRequestSchema,
  useEditClientRequestMutation,
} from "@/features/client";
import { useEffect, useState } from "react";
import {
  fillDictionaries,
  getFacadesByType,
} from "@/features/client/services/client/real";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { usePriceCalculator } from "@/features/client/hooks/usePriceCalculator";
import BottomActionBar from "@/features/client/component/BottomActionBar";
import { Step1Form } from "@/shared/components/form/request/Step1Form";
import { Step2Form } from "@/shared/components/form/request/Step2Form";
import { Step3Form } from "@/shared/components/form/request/Step3Form";
import { useProfileQuery } from "@/features/profiles";
import { useFurnitureId } from "@/features/furniture/hook/useFurniture";
import { Order } from "@/features/workshop/types";

interface OrderResponse {
  data: Order;
}

interface ClientWidgetProps {
  onStepChange?: (step: number) => void;
}

export function ClientWidget({ onStepChange }: ClientWidgetProps) {
  const router = useRouter();

  const params = useParams();
  const requestId = params.id ? parseInt(params.id as string) : NaN;

  const {
    data: dataIdFurniture,
    isPending,
    isError,
  } = useFurnitureId(requestId, {
    enabled: !isNaN(requestId),
  }) as {
    data: any | undefined;
    isPending: boolean;
    isError: boolean;
  };

  const orderData = dataIdFurniture?.data;

  const ClientMutation = useClientRequesMutation();
  const ClientEditMutation = useEditClientRequestMutation(requestId);
  const { data: session } = useSession();
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<number | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(1);

  const userRole = (session as any)?.loginOut?.role;

  const profile = useProfileQuery({
    enabled: !!userRole, // Запрос выполнится только если userRole существует
  });

  // 1. Сначала создаем форму без схемы
  // В useForm
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    trigger,
    reset,
  } = useForm<TClientRequestSchema>({
    defaultValues: {
      furniture_type_id: orderData?.furniture_type?.id || undefined,
      workshop_id: orderData?.workshop_id || undefined,
      address: orderData?.address || "",
      description: orderData?.description || "",
      furniture_subtype_id: orderData?.furniture_data?.type?.id || undefined,
      frame_id: orderData?.furniture_data?.frame?.id || undefined,
      facade_id: orderData?.furniture_data?.facade?.id || undefined,
      facade_type_id: orderData?.furniture_data?.facade_type?.id || undefined,
      facade_color_id: orderData?.furniture_data?.facade_color?.id || undefined,
      brand_id: orderData?.furniture_data?.brand?.id || undefined,
      length: orderData?.furniture_data?.length || undefined,
      height: undefined,
      filling: orderData?.furniture_data?.filling || [],
      subtype_data: {},
      addons: orderData?.furniture_data?.addons || [],
      kitchen_tabletop_id:
        orderData?.furniture_data?.kitchen_tabletop_id || undefined,
      console_tabletop_id:
        orderData?.furniture_data?.console_tabletop_id || undefined,
      client_name: orderData?.client_name || undefined,
      client_iin: orderData?.client_iin || undefined,
      client_phone: orderData?.client_phone || undefined,
      client_address: orderData?.client_address || undefined,
    },
  });

  // В useEffect
  useEffect(() => {
    if (orderData) {
      reset({
        furniture_type_id: orderData.furniture_type?.id || undefined,
        workshop_id: orderData.workshop_id || undefined,
        address: orderData.address || "",
        description: orderData?.description || "",
        furniture_subtype_id: orderData.furniture_data?.type?.id || undefined,
        frame_id: orderData.furniture_data?.frame?.id || undefined,
        facade_id: orderData.furniture_data?.facade?.id || undefined,
        facade_type_id: orderData.furniture_data?.facade_type?.id || undefined,
        facade_color_id:
          orderData.furniture_data?.facade_color?.id || undefined,
        brand_id: orderData.furniture_data?.brand?.id || undefined,
        length: orderData.furniture_data?.length || undefined,
        height: undefined,
        filling: orderData.furniture_data?.filling || [],
        subtype_data: {},
        addons: orderData.furniture_data?.addons || [],
        kitchen_tabletop_id:
          orderData?.furniture_data?.kitchen_tabletop_id || undefined,
        console_tabletop_id:
          orderData?.furniture_data?.console_tabletop_id || undefined,
        client_name: orderData.client_name || undefined,
        client_iin: orderData.client_iin || undefined,
        client_phone: orderData.client_phone || undefined,
        client_address: orderData.client_address || undefined,
      });
    }
  }, [orderData, reset]);

  useEffect(() => {
    if (profile.data) {
      reset(
        {
          client_name: profile.data.user?.name || "",
          client_phone: profile.data.user?.phone || "",
          client_address: profile.data.user?.client_data?.address || "",
        },
        {
          keepValues: true, // Сохранить другие значения формы
          keepDirty: false,
        },
      );
    }
  }, [profile.data, reset]);

  // 2. Затем получаем значения полей
  const watchedFields = watch([
    "furniture_type_id",
    "furniture_subtype_id",
    "frame_id",
    "facade_id",
    "facade_type_id",
    "facade_color_id",
    "brand_id",
    "length",
    "height",
    "filling",
    "subtype_data",
    "addons",
    "address",
    "workshop_id",
    "mirror_backlight_id",
    "mirror_form_id",
    "mirror_frame_id",
    "kitchen_tabletop_id",
    "console_tabletop_id",
    "client_name",
    "client_address",
    "client_iin",
    "client_phone",
  ]);

  const [
    furniture_type_id,
    furniture_subtype_id,
    frame_id,
    facade_id,
    facade_type_id,
    facade_color_id,
    brand_id,
    length,
    height,
    filling,
    subtype_data,
    addons,
    address,
    workshop_id,
    mirror_frame_id,
    mirror_backlight_id,
    mirror_form_id,
    kitchen_tabletop_id,
    console_tabletop_id,
    client_name,
    client_address,
    client_iin,
    client_phone,
  ] = watchedFields;

  // 3. Теперь создаем схему с текущими значениями
  const schema = useClientRequestSchema();

  // 4. Применяем схему к форме после ее создания
  useEffect(() => {
    if (schema) {
      reset(undefined, {
        keepValues: true,
        keepErrors: true,
        keepDirty: true,
        keepIsValid: false,
      });
    }
  }, [schema, reset]);

  const { priceRange, isLoadingPrice } = usePriceCalculator({
    watchedFields,
    furniture_type_id,
    furniture_subtype_id,
    frame_id,
    facade_id,
    facade_type_id,
    facade_color_id,
    brand_id,
    length,
    height,
    filling,
    addons,
    address,
    workshop_id,
    subtype_data,
    mirror_frame_id,
    mirror_backlight_id,
    mirror_form_id,
    console_tabletop_id,
    kitchen_tabletop_id,
  });

  useEffect(() => {
    fillDictionaries().then((data) => {
      setDictionaries(data);
    });
  }, []);

  const [dictionaries, setDictionaries] = useState({
    furnitureSubtypes: [],
    frames: [],
    furnitureTypes: [],
    brands: [],
    facades: [],
    addons: [],
    addonsType: [],
    filling: [],
    workshops: [],
    kitchenTabletops: [],
    mirrorFrames: [],
    mirrorBacklights: [],
    mirrorForms: [],
    consoleTabletops: [],
  });

  useEffect(() => {
    if (selectedFurnitureId) {
      getFacadesByType(selectedFurnitureId).then((facadesData) => {
        setDictionaries((prev) => ({
          ...prev,
          facades: facadesData,
        }));
      });
    } else {
      getFacadesByType().then((facadesData) => {
        setDictionaries((prev) => ({
          ...prev,
          facades: facadesData,
        }));
      });
    }
  }, [selectedFurnitureId]);

  // Валидация для перехода между этапами
  // Валидация для перехода между этапами
  const canProceedToStep2 = () => {
    // Конфигурация типов, для которых подтип не обязателен
    const SUBTYPE_OPTIONAL_TYPES = [3, 5];
    // Можно расширить: [3, 5, 6] если и для других типов сделать подтип необязательным

    // Базовая проверка типа
    if (!furniture_type_id) return false;

    // Проверяем, требуется ли подтип для текущего типа
    const subtypeRequired = !SUBTYPE_OPTIONAL_TYPES.includes(furniture_type_id);

    // Если подтип требуется, но не выбран - возвращаем false
    if (subtypeRequired && !furniture_subtype_id) return false;

    // Для типа 3 - проверяем только тип и длину
    if (furniture_type_id === 3) {
      return !!length;
    }

    // Для шкафов (type_id = 2)
    if (furniture_type_id === 2) {
      const hasLengthAndHeight = !!length && !!height;

      if (furniture_subtype_id === 5 || furniture_subtype_id === 6) {
        return hasLengthAndHeight && !!subtype_data?.count_door;
      }
      return hasLengthAndHeight;
    }

    // Для кухни (type_id = 1)
    if (furniture_type_id === 1) {
      if (furniture_subtype_id === 2) {
        return !!(subtype_data?.length_first && subtype_data?.length_second);
      }
      if (furniture_subtype_id === 3) {
        return !!(
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.length_third
        );
      }
      if (furniture_subtype_id === 4) {
        return !!length && !!subtype_data?.length;
      }
      // Для подтипа 1 и других
      return !!length;
    }

    // Для type_id = 4
    if (furniture_type_id === 4) {
      if (furniture_subtype_id === 7) {
        return !!(subtype_data?.length && subtype_data?.height);
      }
      if (furniture_subtype_id === 8) {
        return !!(
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.height
        );
      }
      if (furniture_subtype_id === 9) {
        return !!(
          subtype_data?.height &&
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.length_third
        );
      }
    }

    // Для остальных типов - требуем длину
    return !!length;
  };

  const canProceedToStep3 = () => {
    // Для типа 5 (зеркало) - проверяем только mirror поля
    if (furniture_type_id === 5) {
      return !!(mirror_frame_id && mirror_backlight_id && mirror_form_id);
    }

    // Для типа 3 - подтип не обязателен
    if (furniture_type_id === 3) {
      return !!(frame_id && brand_id && addons);
    }

    // Конфигурация типов, для которых addons не обязателен
    const ADDONS_OPTIONAL_TYPES = [3, 5];

    // Проверяем, требуется ли addons для текущего типа
    const addonsRequired = !ADDONS_OPTIONAL_TYPES.includes(
      furniture_type_id || 0,
    );

    // Базовая проверка: для типов 3 и 5 addons не проверяем
    const baseCheck = addonsRequired
      ? !!(frame_id && brand_id && addons && furniture_subtype_id)
      : !!(frame_id && brand_id && furniture_subtype_id);

    if (!baseCheck) return false;

    // Для type_id = 4 фасад не обязателен
    if (furniture_type_id === 4) {
      // Для типа 4 требуем length
      if (!length) return false;

      // Проверяем subtype_data в зависимости от подтипа
      if (furniture_subtype_id === 7) {
        return !!(subtype_data?.length && subtype_data?.height);
      }
      if (furniture_subtype_id === 8) {
        return !!(
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.height
        );
      }
      if (furniture_subtype_id === 9) {
        return !!(
          subtype_data?.height &&
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.length_third
        );
      }
      return true;
    }

    // Для остальных типов фасад обязателен
    if (!facade_id) return false;
    if (!facade_type_id) return false;

    // Конфигурация обязательных полей length по типам и подтипам
    const requiredLengthConfig: any = {
      1: [1], // для type 1, только subtype 1 требует length
    };

    // Проверяем, требуется ли length для текущего типа и подтипа
    const requiresLength = requiredLengthConfig[
      furniture_type_id || 0
    ]?.includes(furniture_subtype_id || 0);

    // Если требуется length, проверяем его наличие
    if (requiresLength && !length) return false;

    // Для всех остальных случаев возвращаем true
    return true;
  };

  const canSubmitStep3 = () => {
    // Для типа 5 (зеркало) - проверяем только mirror поля
    if (furniture_type_id === 5) {
      return !!(
        furniture_type_id &&
        mirror_frame_id &&
        mirror_backlight_id &&
        mirror_form_id &&
        workshop_id
      );
    }

    // Для типа 3 - подтип не обязателен
    if (furniture_type_id === 3) {
      return !!(furniture_type_id && frame_id && workshop_id);
    }

    // Конфигурация: для каких комбинаций тип-подтип length обязателен
    const REQUIRED_LENGTH_CONFIG: any = {
      1: [1], // для type 1, только subtype 1 требует length
    };

    // Базовая проверка для всех типов
    const baseRequired = !!(
      furniture_type_id &&
      furniture_subtype_id &&
      frame_id &&
      workshop_id
    );

    if (!baseRequired) return false;

    // Для типа 4 отдельная логика
    if (furniture_type_id === 4) {
      if (furniture_subtype_id === 7) {
        return !!(subtype_data?.length && subtype_data?.height);
      }
      if (furniture_subtype_id === 8) {
        return !!(
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.height
        );
      }
      if (furniture_subtype_id === 9) {
        return !!(
          subtype_data?.height &&
          subtype_data?.length_first &&
          subtype_data?.length_second &&
          subtype_data?.length_third
        );
      }
      return false;
    }

    // Проверяем, требуется ли length для текущей комбинации
    const lengthConfig = REQUIRED_LENGTH_CONFIG[furniture_type_id];

    if (lengthConfig) {
      if (lengthConfig === "all") {
        // Для всех подтипов этого типа length обязателен
        return !!length;
      } else if (
        Array.isArray(lengthConfig) &&
        lengthConfig.includes(furniture_subtype_id)
      ) {
        // Для конкретных подтипов length обязателен
        return !!length;
      } else {
        // Для других подтипов этого типа length не обязателен
        return true;
      }
    }

    // Для типов не указанных в конфигурации length обязателен
    return !!length;
  };

  // Форматируем цену для отображения
  // Форматируем цену для отображения
  const formatPrice = (price: number | undefined) => {
    if (!price) return "0";
    return price.toLocaleString("ru-RU");
  };

  const nextStep = async () => {
    let isValid = false;
    let fieldsToValidate = [];

    if (currentStep === 1) {
      fieldsToValidate = ["furniture_type_id", "furniture_subtype_id"];

      // Добавляем length для всех, кроме type_id = 4
      if (
        !(
          furniture_type_id === 4 &&
          [7, 8, 9].includes(furniture_subtype_id as any)
        )
      ) {
        fieldsToValidate.push("length");
      }

      // Добавляем height для всех, кроме type_id = 4
      if (
        !(
          furniture_type_id === 4 &&
          [7, 8, 9].includes(furniture_subtype_id as any)
        )
      ) {
        fieldsToValidate.push("height");
      }

      // Добавляем соответствующие поля subtype_data
      if (furniture_type_id === 1) {
        if (furniture_subtype_id === 2) {
          fieldsToValidate.push(
            "subtype_data.length_first",
            "subtype_data.length_second",
          );
        } else if (furniture_subtype_id === 3) {
          fieldsToValidate.push(
            "subtype_data.length_first",
            "subtype_data.length_second",
            "subtype_data.length_third",
          );
        } else if (furniture_subtype_id === 4) {
          fieldsToValidate.push("subtype_data.length");
        }
      }

      if (furniture_type_id === 2) {
        if (furniture_subtype_id === 5 || furniture_subtype_id === 6) {
          fieldsToValidate.push("subtype_data.count_door");
        }
      }

      if (furniture_type_id === 4) {
        if (furniture_subtype_id === 7) {
          fieldsToValidate.push("subtype_data.length", "subtype_data.height");
        } else if (furniture_subtype_id === 8) {
          fieldsToValidate.push(
            "subtype_data.length_first",
            "subtype_data.length_second",
            "subtype_data.height",
          );
        } else if (furniture_subtype_id === 9) {
          fieldsToValidate.push(
            "subtype_data.height",
            "subtype_data.length_first",
            "subtype_data.length_second",
            "subtype_data.length_third",
          );
        }
      }

      isValid = await trigger(fieldsToValidate as any);

      if (isValid && canProceedToStep2()) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        onStepChange?.(newStep);
      } else {
        toast.error("Заполните все обязательные поля первого этапа");
      }
    } else if (currentStep === 2) {
      // Для типа 4 фасад не обязателен
      if (furniture_type_id === 4) {
        fieldsToValidate = ["frame_id"];
      } else {
        fieldsToValidate = ["frame_id", "facade_id", "facade_type_id"];
      }

      isValid = await trigger(fieldsToValidate as any);

      if (isValid && canProceedToStep3()) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        onStepChange?.(newStep);
      } else {
        toast.error("Заполните все обязательные поля второго этапа");
      }
    }
  };

  const prevStep = () => {
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    onStepChange?.(newStep);
  };

  // Обновленная функция onSubmit для учета типа 4
  // В ClientWidget - исправленная функция onSubmit:
  async function onSubmit(loginData: TClientRequestSchema) {
    // Преобразуем данные для API
    const apiData: any = {
      furniture_type_id: loginData.furniture_type_id,

      description: loginData.description,
      furniture_subtype_id: loginData.furniture_subtype_id,
      frame_id: loginData.frame_id,
      brand_id: loginData.brand_id,
      workshop_id: loginData.workshop_id,
      client_address: loginData.client_address,
      client_iin: loginData.client_iin,
      client_name: loginData.client_name,
      client_phone: loginData.client_phone,

      filling:
        loginData.filling
          ?.map((item) => ({
            id: Number(item.id),
            count: Number(item.count),
          }))
          .filter((item) => item.id && item.count > 0) || [],

      addons:
        loginData.addons
          ?.map((addon) => ({
            id: Number(addon.id),
            data_type: addon.data_type,
            count: Number(addon.count),
            length: Number(addon.length),
          }))
          .filter(
            (addon) =>
              addon.id &&
              addon.data_type &&
              addon.count > 0 &&
              addon.length > 0,
          ) || [],
    };

    // Для типа 4 фасад не добавляем
    if (loginData.furniture_type_id !== 4) {
      if (loginData.facade_id) apiData.facade_id = loginData.facade_id;
      if (loginData.facade_type_id)
        apiData.facade_type_id = loginData.facade_type_id;
      if (loginData.facade_color_id)
        apiData.facade_color_id = loginData.facade_color_id;
    }

    if (loginData.mirror_frame_id)
      apiData.mirror_frame_id = loginData.mirror_frame_id;
    if (loginData.mirror_backlight_id)
      apiData.mirror_backlight_id = loginData.mirror_backlight_id;
    if (loginData.mirror_form_id)
      apiData.mirror_form_id = loginData.mirror_form_id;

    if (
      loginData.kitchen_tabletop_id !== undefined &&
      loginData.kitchen_tabletop_id !== null
    ) {
      apiData.kitchen_tabletop_id = loginData.kitchen_tabletop_id;
    }

    if (
      loginData.console_tabletop_id !== undefined &&
      loginData.console_tabletop_id !== null
    ) {
      apiData.console_tabletop_id = loginData.console_tabletop_id;
    }

    // Обрабатываем subtype_data отдельно
    const cleanedSubtypeData: Record<string, any> = {};

    // Для кухни (type_id = 1) - особая логика
    if (loginData.furniture_type_id === 1) {
      // Основная длина для кухни в subtype_data
      if (loginData.length !== undefined && loginData.length !== null) {
        cleanedSubtypeData.length = loginData.length;
      }
      // Высота для кухни на верхнем уровне (если есть)
      if (loginData.height !== undefined && loginData.height !== null) {
        apiData.height = loginData.height;
      }

      // Дополнительные длины для кухни
      if (loginData.subtype_data) {
        if (loginData.subtype_data.length_first)
          cleanedSubtypeData.length_first = Number(
            loginData.subtype_data.length_first,
          );
        if (loginData.subtype_data.length_second)
          cleanedSubtypeData.length_second = Number(
            loginData.subtype_data.length_second,
          );
        if (loginData.subtype_data.length_third)
          cleanedSubtypeData.length_third = Number(
            loginData.subtype_data.length_third,
          );
      }
    }
    // Для шкафов (type_id = 2) - длина и высота на верхнем уровне
    else if (loginData.furniture_type_id === 2) {
      if (loginData.length !== undefined && loginData.length !== null) {
        apiData.length = loginData.length;
      }
      if (loginData.height !== undefined && loginData.height !== null) {
        apiData.height = loginData.height;
      }

      // Для шкафов добавляем только count_door в subtype_data
      if (loginData.subtype_data?.count_door) {
        cleanedSubtypeData.count_door = Number(
          loginData.subtype_data.count_door,
        );
      }
    }
    // Для типа 4 (furniture_type_id = 4) - ВСЕ измерения ОБЯЗАТЕЛЬНЫ
    else if (loginData.furniture_type_id === 4) {
      // Обязательные поля для типа 4
      if (loginData.length !== undefined && loginData.length !== null) {
        apiData.length = loginData.length;
      }
      if (loginData.height !== undefined && loginData.height !== null) {
        apiData.height = loginData.height;
      }

      // Также добавляем в subtype_data если есть
      if (loginData.subtype_data) {
        if (loginData.subtype_data.length)
          cleanedSubtypeData.length = Number(loginData.subtype_data.length);
        if (loginData.subtype_data.length_first)
          cleanedSubtypeData.length_first = Number(
            loginData.subtype_data.length_first,
          );
        if (loginData.subtype_data.length_second)
          cleanedSubtypeData.length_second = Number(
            loginData.subtype_data.length_second,
          );
        if (loginData.subtype_data.length_third)
          cleanedSubtypeData.length_third = Number(
            loginData.subtype_data.length_third,
          );
        if (loginData.subtype_data.height)
          cleanedSubtypeData.height = Number(loginData.subtype_data.height);
      }

      // Дополнительная проверка: убеждаемся, что переданы обязательные поля
      if (!apiData.length || !apiData.height) {
        toast.error("Для этого типа мебели обязательны длина и высота");
        return;
      }
    }
    // Для остальных типов - длина и высота на верхнем уровне
    else {
      if (loginData.length !== undefined && loginData.length !== null) {
        apiData.length = loginData.length;
      }
      if (loginData.height !== undefined && loginData.height !== null) {
        apiData.height = loginData.height;
      }

      // Дополнительные subtype_data для остальных типов
      if (loginData.subtype_data) {
        Object.entries(loginData.subtype_data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== ("" as any)) {
            cleanedSubtypeData[key] = Number(value);
          }
        });
      }
    }

    // Просто добавляем его в subtype_data, если нужно
    if (
      loginData.kitchen_tabletop_id !== undefined &&
      loginData.kitchen_tabletop_id !== null
    ) {
      cleanedSubtypeData.kitchen_tabletop_id = loginData.kitchen_tabletop_id;
    }

    // Добавляем subtype_data только если есть значения
    if (Object.keys(cleanedSubtypeData).length > 0) {
      apiData.subtype_data = cleanedSubtypeData;
    }

    // Удаляем пустые массивы
    if (apiData.filling && apiData.filling.length === 0) {
      delete apiData.filling;
    }
    if (apiData.addons && apiData.addons.length === 0) {
      delete apiData.addons;
    }

    // Удаляем остальные undefined значения
    Object.keys(apiData).forEach((key) => {
      if (apiData[key] === undefined || apiData[key] === null) {
        delete apiData[key];
      }
    });

    try {
      // Если есть requestId (редактирование), используем ClientEditMutation
      if (requestId && !isNaN(requestId)) {
        await ClientEditMutation.mutateAsync(apiData, {
          onSuccess: (data) => {
            toast.success("Заявка успешно обновлена!");
            router.push(`/furniture/list`);
          },
          onError: (error) => {
            console.error("Edit error:", error);
            console.error("Submitted data:", apiData);
            if (!userRole) {
              router.push("/auth");
              return;
            }
            toast.error("Ошибка при обновлении заявки");
          },
        });
      }
      // Иначе создаем новую заявку
      else {
        await ClientMutation.mutateAsync(apiData, {
          onSuccess: (data) => {
            toast.success("Заявка успешно создана!");
            router.push(`/furniture/list`);
          },
          onError: (error) => {
            console.error("Submit error:", error);
            console.error("Submitted data:", apiData);
            if (!userRole) {
              router.push("/auth");
              return;
            }
            toast.error("Заполните все поля");
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Form
            control={control}
            errors={errors}
            dictionaries={dictionaries}
            furniture_type_id={furniture_type_id}
            furniture_subtype_id={furniture_subtype_id}
            setSelectedFurnitureId={setSelectedFurnitureId}
          />
        );
      case 2:
        return (
          <Step2Form
            control={control}
            errors={errors}
            dictionaries={dictionaries}
            furniture_type_id={furniture_type_id}
            furniture_subtype_id={furniture_subtype_id}
            frame_id={frame_id}
            facade_id={facade_id}
            facade_type_id={facade_type_id}
            length={length}
            selectedFurnitureId={selectedFurnitureId}
          />
        );
      case 3:
        return (
          <Step3Form
            control={control}
            errors={errors}
            dictionaries={dictionaries}
            furniture_type_id={furniture_type_id}
            furniture_subtype_id={furniture_subtype_id}
            frame_id={frame_id}
            length={length}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-t-2xl flex flex-col items-center p-4 pb-[210px]"
    >
      {renderStep()}

      <BottomActionBar
        isLoadingPrice={isLoadingPrice}
        priceRange={priceRange}
        formatPrice={formatPrice}
        isSubmitting={isSubmitting}
        disabled={!canSubmitStep3() || isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        currentStep={currentStep}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        canProceedToNext={Boolean(
          currentStep === 1
            ? canProceedToStep2()
            : currentStep === 2
              ? canProceedToStep3()
              : true,
        )}
      />
    </form>
  );
}
