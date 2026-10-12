import { useState, useEffect, useRef } from 'react';
import { getPrice } from '../services/client/real';

interface PriceRange {
  price_from: number;
  price_to: number;
  price?: number;
}

interface UsePriceCalculatorProps {
  watchedFields: any[];
  furniture_type_id?: number;
  furniture_subtype_id?: number;
  frame_id?: number;
  facade_id?: number;
  facade_type_id?: number;
  facade_color_id?: number;
  brand_id?: number;
  length?: number;
  height?: number;
  filling?: any[];
  addons?: any[];
  address?: string;
  workshop_id?: number;
  subtype_data?: {
    length?: number;
    length_first?: number;
    length_second?: number;
    length_third?: number;
    height?: number;
    count_door?: number;
    
  };
  // Добавляем поля для зеркала
  mirror_frame_id?: number;
  mirror_backlight_id?: number;
  mirror_form_id?: number;
  console_tabletop_id: any;
  kitchen_tabletop_id: any;
}

export const usePriceCalculator = ({
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
}: UsePriceCalculatorProps) => {
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  
  const prevFieldsRef = useRef(watchedFields);
  const timeoutRef = useRef<number | null>(null);

  // Функция для подготовки данных
  const prepareData = (data: any) => {
    const prepared = { ...data };

    // Удаляем пустые массивы
    if (prepared.filling && prepared.filling.length === 0) {
      delete prepared.filling;
    }
    
    if (prepared.addons && prepared.addons.length === 0) {
      delete prepared.addons;
    }

    if (prepared.subtype_data) {
      // Проверяем, есть ли хоть одно значение в subtype_data
      const hasSubtypeData = Object.values(prepared.subtype_data).some(
        val => val !== undefined && val !== null && val !== ''
      );
      
      if (!hasSubtypeData) {
        delete prepared.subtype_data;
      } else {
        // Удаляем undefined значения внутри объекта
        Object.keys(prepared.subtype_data).forEach((key) => {
          if (prepared.subtype_data[key] === undefined || prepared.subtype_data[key] === null || prepared.subtype_data[key] === '') {
            delete prepared.subtype_data[key];
          }
        });
      }
    }

    // Удаляем undefined значения
    Object.keys(prepared).forEach((key) => {
      if (prepared[key] === undefined || prepared[key] === null) {
        delete prepared[key];
      }
    });

    return prepared;
  };

  useEffect(() => {
  const calculatePrice = async () => {
    // Для типа 5 (зеркало) - отдельная логика
    if (furniture_type_id === 5) {
      // Для зеркала требуем только зеркальные поля
      if (!furniture_type_id || !mirror_frame_id || !mirror_backlight_id || !mirror_form_id) {
        setPriceRange(null);
        return;
      }

      const priceData: any = {
        furniture_type_id,
        mirror_frame_id,
        mirror_backlight_id,
        mirror_form_id,
        brand_id,
        address,
        workshop_id,
        // Для зеркала filling и addons не обязательны
        filling: filling || [],
        addons: addons || [],
      };

      // Для зеркала length и height обязательны (размеры зеркала)
      if (length) {
        priceData.length = length;
      }
      if (height) {
        priceData.height = height;
      }

      // ДОБАВЛЯЕМ: kitchen_tabletop_id и console_tabletop_id если есть
      if (kitchen_tabletop_id) priceData.kitchen_tabletop_id = kitchen_tabletop_id;
      if (console_tabletop_id) priceData.console_tabletop_id = console_tabletop_id;

      const preparedData = prepareData(priceData);

      // Проверяем обязательные поля для зеркала
      if (!length || !height) {
        setPriceRange(null);
        return;
      }

      setIsLoadingPrice(true);
      try {
        const result = await getPrice(preparedData);
        if (
          result.data &&
          result.data.price_from !== undefined &&
          result.data.price_to !== undefined &&
          result.data.price !== undefined 
        ) {
          setPriceRange({
            price_from: result.data.price_from,
            price_to: result.data.price_to,
           price: result.data.price || Math.round((result.data.price_from + result.data.price_to) / 2)
          });
        } else {
          setPriceRange(null);
        }
      } catch (error) {
        console.error("Failed to calculate price:", error);
        setPriceRange(null);
      } finally {
        setIsLoadingPrice(false);
      }
      return;
    }

    // Оригинальная логика для остальных типов (1-4)
    // Проверяем, что все обязательные поля заполнены
    // Для типа 3 frame_id не обязателен
    const frameIdRequired = furniture_type_id !== 3;
    
    if (!furniture_type_id || !furniture_subtype_id || (frameIdRequired && !frame_id)) {
      setPriceRange(null);
      return;
    }

    // Подготавливаем данные для отправки
    const priceData: any = {
      furniture_type_id,
      furniture_subtype_id,
      brand_id,
      address,
      workshop_id,
      addons: addons || [],
    };

    // ДОБАВЛЯЕМ: kitchen_tabletop_id и console_tabletop_id в данные для цены
    if (kitchen_tabletop_id) priceData.kitchen_tabletop_id = kitchen_tabletop_id;
    if (console_tabletop_id) priceData.console_tabletop_id = console_tabletop_id;

    // Добавляем filling только если это не тип 3
    if (furniture_type_id !== 3) {
      priceData.filling = filling || [];
    }

    // Добавляем frame_id для всех типов кроме 3
    if (frame_id && furniture_type_id !== 3) {
      priceData.frame_id = frame_id;
    }

    // Обработка длины (length) и высоты (height) в зависимости от типа мебели
    if (furniture_type_id === 1) {
      // Для кухни (type_id = 1) - длина в subtype_data, высота на верхнем уровне
      const kitchenSubtypeData: any = {};
      
      // Добавляем длину только для subtype 1
      if (furniture_subtype_id === 1 && length) {
        kitchenSubtypeData.length = length;
      }
      
      // Дополнительные длины для кухни
      if (subtype_data?.length_first) kitchenSubtypeData.length_first = subtype_data.length_first;
      if (subtype_data?.length_second) kitchenSubtypeData.length_second = subtype_data.length_second;
      if (subtype_data?.length_third) kitchenSubtypeData.length_third = subtype_data.length_third;
      
      if (Object.keys(kitchenSubtypeData).length > 0) {
        priceData.subtype_data = kitchenSubtypeData;
      }
      
      // Высота для кухни на верхнем уровне
      if (height) {
        priceData.height = height;
      }
    } 
    else if (furniture_type_id === 2) {
      // Для шкафов (type_id = 2) - длина и высота на верхнем уровне
      if (length) {
        priceData.length = length;
      }
      if (height) {
        priceData.height = height;
      }
      
      // Для шкафов добавляем только count_door в subtype_data
      if (subtype_data?.count_door) {
        priceData.subtype_data = {
          count_door: subtype_data.count_door
        };
      }
    } 
    else if (furniture_type_id === 4) {
      // Для типа 4 (furniture_type_id = 4) - все измерения в subtype_data
      const type4SubtypeData: any = {};
      if (subtype_data?.length) type4SubtypeData.length = subtype_data.length;
      if (subtype_data?.length_first) type4SubtypeData.length_first = subtype_data.length_first;
      if (subtype_data?.length_second) type4SubtypeData.length_second = subtype_data.length_second;
      if (subtype_data?.length_third) type4SubtypeData.length_third = subtype_data.length_third;
      if (subtype_data?.height) type4SubtypeData.height = subtype_data.height;
      
      if (Object.keys(type4SubtypeData).length > 0) {
        priceData.subtype_data = type4SubtypeData;
      }
      
      // ДЛЯ ТИПА 4 - также добавляем height и length на верхнем уровне если они есть
      if (height) {
        priceData.height = height;
      }
      if (length) {
        priceData.length = length;
      }
    } 
    else {
      // Для остальных типов - длина и высота на верхнем уровне
      if (length) {
        priceData.length = length;
      }
      if (height) {
        priceData.height = height;
      }
      
      // Дополнительные subtype_data для остальных типов
      if (subtype_data) {
        priceData.subtype_data = { ...subtype_data };
      }
    }

    // Добавляем фасадные параметры только для типов, где они доступны
    if (furniture_type_id !== 4) {
      if (facade_id) priceData.facade_id = facade_id;
      if (facade_type_id) priceData.facade_type_id = facade_type_id;
      if (facade_color_id) priceData.facade_color_id = facade_color_id;
    }

    const preparedData = prepareData(priceData);

    // Проверяем, достаточно ли данных для расчета цены
    let hasRequiredFields = false;
    
    if (furniture_type_id === 1) {
      // Для кухни проверяем обязательные поля в зависимости от подтипа
      if (furniture_subtype_id === 1) {
        // Только для subtype 1 length обязателен
        hasRequiredFields = !!length;
      } else {
        // Для других подтипов кухни length не обязателен
        hasRequiredFields = true;
      }
    } 
    else if (furniture_type_id === 2) {
      // Для шкафов требуем length и height
      hasRequiredFields = !!(length && height);
    }
    else if (furniture_type_id === 4) {
      // Для типа 4 проверяем subtype_data в зависимости от подтипа
      if (furniture_subtype_id === 7) {
        hasRequiredFields = !!(subtype_data?.length && subtype_data?.height);
      } else if (furniture_subtype_id === 8) {
        hasRequiredFields = !!(subtype_data?.length_first && subtype_data?.length_second && subtype_data?.height);
      } else if (furniture_subtype_id === 9) {
        hasRequiredFields = !!(subtype_data?.height && subtype_data?.length_first && subtype_data?.length_second && subtype_data?.length_third);
      } else {
        // Для других подтипов типа 4 можно использовать height и length с верхнего уровня
        hasRequiredFields = !!(height && length);
      }
    }
    else if (furniture_type_id === 3) {
      // Для типа 3 требуем только length, filling не обязателен
      hasRequiredFields = !!length;
      
      // Удаляем filling из данных для типа 3, так как он не нужен
      if (preparedData.filling) {
        delete preparedData.filling;
      }
    }
    else {
      // Для остальных типов требуем length
      hasRequiredFields = !!length;
    }

    // Проверяем обязательные поля для всех типов
    const commonRequiredFields = !!(furniture_type_id && furniture_subtype_id);
    
    if (!commonRequiredFields || !hasRequiredFields) {
      setPriceRange(null);
      return;
    }

    // Для фасадных типов (не 4) проверяем фасадные поля
    if (furniture_type_id !== 4) {
      if (facade_id && !facade_type_id) {
        setPriceRange(null);
        return;
      }
    }

    setIsLoadingPrice(true);
    try {
      const result = await getPrice(preparedData);
      if (
        result.data &&
        result.data.price_from !== undefined &&
        result.data.price_to !== undefined
      ) {
        setPriceRange({
          price_from: result.data.price_from,
          price_to: result.data.price_to,
          price: result.data.price || Math.round((result.data.price_from + result.data.price_to) / 2)
        });
      } else {
        setPriceRange(null);
      }
    } catch (error) {
      console.error("Failed to calculate price:", error);
      setPriceRange(null);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Проверяем, действительно ли изменились поля
  const fieldsChanged = watchedFields.some(
    (field, index) =>
      JSON.stringify(field) !== JSON.stringify(prevFieldsRef.current[index]),
  );

  if (fieldsChanged) {
    // Обновляем предыдущие значения
    prevFieldsRef.current = watchedFields;

    // Очищаем предыдущий таймаут
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Добавляем задержку для избежания частых запросов
    timeoutRef.current = window.setTimeout(calculatePrice, 500);
  }

  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, [
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
]);

  return {
    priceRange,
    isLoadingPrice,
  };
};