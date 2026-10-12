import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { NextStatusOrders, Order, Orders } from "../services/api";
import type { QueryParams } from "@/features/request/types";

export const useOrders = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await Orders(params || {});
      if (!response.success) throw new Error(response.error);
      return response.data.data;
    },
  });
};

export const useOrderId = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await Order(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useOrderNextStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await NextStatusOrders(id);
      if (!response.success) throw new Error(response.error);
      return { id };
    },
    onSuccess: (result) => {
      // Инвалидируем список заказов
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Инвалидируем конкретный заказ
      queryClient.invalidateQueries({ queryKey: ["order", result.id] });
    },
    onError: (error) => {
      console.error("Ошибка при смене статуса заказа:", error);
    },
  });
};
