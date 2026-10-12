import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NextStatusRequest, Request, Requests } from "../services";
import type { QueryParams } from "../types";

export const useRequest = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: async () => {
      const response = await Requests(params || {});
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useRequestId = (id: number) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const res = await Request(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useRequestNextStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await NextStatusRequest(id);
      if (!response.success) throw new Error(response.error);
      return { id };
    },
    onSuccess: (result) => {
      // Инвалидируем список заявок
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // Инвалидируем конкретную заявку
      queryClient.invalidateQueries({ queryKey: ["request", result.id] });
    },
    onError: (error) => {
      console.error("Ошибка при смене статуса заявки:", error);
    },
  });
};
