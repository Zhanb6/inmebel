import { useMemo } from 'react';

interface DictionaryItem {
  id: number;
  name: string;
  furniture_type_id?: number;
  types?: any[];
  colors?: any[];
  data_type?: string;
  media?: any;
}

interface FurnitureType {
  id: number;
  name: string;
  subtypes: DictionaryItem[];
}

interface FacadeType {
  id: number;
  name: string;
  types: DictionaryItem[];
  colors: DictionaryItem[];
}

interface Dictionaries {
  furnitureTypes: FurnitureType[];
  frames: DictionaryItem[];
  brands: DictionaryItem[];
  facades: FacadeType[]; // Обновляем тип для фасадов
  addons: DictionaryItem[];
  addonsType: DictionaryItem[];
  filling: DictionaryItem[];
}

interface UseFormFiltersProps {
  dictionaries: Dictionaries;
  furniture_type_id?: number;
  facade_id?: number;
}

export const useFormFilters = ({
  dictionaries,
  furniture_type_id,
  facade_id,
}: UseFormFiltersProps) => {
  // Фильтруем подтипы по выбранному типу мебели
  const filteredSubtypes = useMemo(() => {
    if (!furniture_type_id) return [];
    
    // Находим выбранный тип мебели
    const selectedFurnitureType = dictionaries.furnitureTypes.find(
      (type: FurnitureType) => type.id === furniture_type_id
    );
    
    // Возвращаем подтипы выбранного типа или пустой массив
    return selectedFurnitureType?.subtypes || [];
  }, [furniture_type_id, dictionaries.furnitureTypes]);

  // Получаем выбранный фасад для доступа к его типам и цветам
  const selectedFacade = useMemo(() => {
    if (!facade_id) return null;
    return dictionaries.facades.find((f: FacadeType) => f.id === facade_id);
  }, [facade_id, dictionaries.facades]);

  // Получаем типы для выбранного фасада
  const facadeTypes = useMemo(() => {
    return selectedFacade?.types || [];
  }, [selectedFacade]);

  // Получаем цвета для выбранного фасада
  const facadeColors = useMemo(() => {
    return selectedFacade?.colors || [];
  }, [selectedFacade]);

  // Проверяем, нужно ли показывать поле высоты
  const showHeightField = useMemo(() => {
    return furniture_type_id && furniture_type_id !== 1;
  }, [furniture_type_id]);

  // Проверяем, нужно ли показывать поля фасада
  const showFacadeFields = useMemo(() => {
    return furniture_type_id && furniture_type_id !== 4;
  }, [furniture_type_id]);

  return {
    filteredSubtypes,
    selectedFacade,
    facadeTypes,
    facadeColors,
    showHeightField,
    showFacadeFields,
  };
};