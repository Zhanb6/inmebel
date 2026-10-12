import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateCategoriesParams,
  QueryParams,
} from "@/features/request/types";
import {
  AttachAtribute,
  Attribute,
  Attributes,
  AttributesList,
  Categories,
  Category,
  CreateAttributes,
  CreateCategories,
  CreateVariants,
  DeletAttribute,
  DeletCategory,
  DelteVariants,
  UpdateAttributes,
  UpdateCategories,
  UpdateVariants,
} from "../services/api";

export const useCategories = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["Categories", params],
    queryFn: async () => {
      const response = await Categories(params || {});
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useCategoryId = (id: number) => {
  return useQuery({
    queryKey: ["Category", id],
    queryFn: async () => {
      const res = await Category(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useClientCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoriesParams) => {
      const response = await CreateCategories(payload);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    retry: false,
    onSuccess: () => {
      // Инвалидируем кеш списка категорий после создания новой
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
    },
    onError: (error) => {
      // Можно добавить уведомление об ошибке
      console.error("Ошибка при создании категории:", error);
    },
  });
};

export const useCategoryUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateCategoriesParams;
    }) => {
      const response = await UpdateCategories(payload, id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    retry: false,
    onSuccess: () => {
      // Инвалидируем кеш для обновленных данных
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      queryClient.invalidateQueries({ queryKey: ["Category"] });
    },
    onError: (error) => {
      // Обработка ошибки (можно добавить уведомление)
      console.error("Ошибка при обновлении категории:", error);
    },
  });
};

export const useCategoryDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await DeletCategory(id);
      if (!response.success) throw new Error(response.error);
      return { id, data: response.data };
    },
    retry: false,
    onSuccess: (result) => {
      // Инвалидируем кеш списка категорий и конкретной категории
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      queryClient.invalidateQueries({ queryKey: ["Category", result.id] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении категории:", error);
    },
  });
};

export const useAttributes = () => {
  return useQuery({
    queryKey: ["Attributes"],
    queryFn: async () => {
      const response = await Attributes();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useAttributesList = () => {
  return useQuery({
    queryKey: ["Attributes", "list"],
    queryFn: async () => {
      const response = await AttributesList();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useAttributeId = (id: number) => {
  return useQuery({
    queryKey: ["Attribute", id],
    queryFn: async () => {
      const res = await Attribute(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!id,
  });
};

// --- MUTATIONS (ИЗМЕНЕНИЕ ДАННЫХ) ---

export const useAttributeCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await CreateAttributes(payload);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      // Обновляем атрибуты и категории
      queryClient.invalidateQueries({ queryKey: ["Attributes"] });
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useAttributeUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await UpdateAttributes(payload, id);
      if (!response.success) throw new Error(response.error);
      return { id, data: response.data };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["Attributes"] });
      queryClient.invalidateQueries({ queryKey: ["Attribute", result.id] });
      // Если атрибут привязан к категориям, обновляем и их
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      queryClient.invalidateQueries({ queryKey: ["Category"] });
    },
  });
};

export const useAttributeDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await DeletAttribute(id);
      if (!response.success) throw new Error(response.error);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["Attributes"] });
      queryClient.removeQueries({ queryKey: ["Attribute", id] });
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

// --- VARIANT MUTATIONS (РАБОТА С ВАРИАНТАМИ) ---

export const useVariantCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const response = await CreateVariants(payload, id);
      if (!response.success) throw new Error(response.error);
      return { attributeId: id };
    },
    onSuccess: (result) => {
      // Обновляем конкретный атрибут, чтобы увидеть новый вариант
      queryClient.invalidateQueries({
        queryKey: ["Attribute", result.attributeId],
      });
      // Обновляем списки
      queryClient.invalidateQueries({ queryKey: ["Attributes"] });
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useVariantUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      variantId,
      payload,
    }: {
      id: number;
      variantId: number;
      payload: any;
    }) => {
      const response = await UpdateVariants(payload, id, variantId);
      if (!response.success) throw new Error(response.error);
      return { attributeId: id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["Attribute", result.attributeId],
      });
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
};

export const useVariantDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      variantId,
      payload,
    }: {
      id: number;
      variantId: number;
      payload: any;
    }) => {
      const response = await DelteVariants(payload, id, variantId);
      if (!response.success) throw new Error(response.error);
      return { attributeId: id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["Attribute", result.attributeId],
      });
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      queryClient.invalidateQueries({ queryKey: ["Category"] });
    },
  });
};

export const useAttributeAttach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      attributeId,
      payload,
    }: {
      id: number;
      attributeId: number;
      payload: any;
    }) => {
      const response = await AttachAtribute(payload, id, attributeId);
      if (!response.success) throw new Error(response.error);
      return { categoryId: id, attributeId };
    },
    onSuccess: (result) => {
      // 1. Обновляем данные конкретной категории, к которой привязали атрибут
      queryClient.invalidateQueries({
        queryKey: ["Category", result.categoryId],
      });

      // 2. Обновляем общий список категорий
      queryClient.invalidateQueries({ queryKey: ["Categories"] });

      // 3. Обновляем данные конкретного атрибута (если нужно отобразить связь)
      queryClient.invalidateQueries({
        queryKey: ["Attribute", result.attributeId],
      });

      // 4. Обновляем общий список атрибутов
      queryClient.invalidateQueries({ queryKey: ["Attributes"] });
    },
    onError: (error) => {
      console.error("Ошибка при привязке атрибута к категории:", error);
    },
  });
};
