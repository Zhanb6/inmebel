import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AcceptWorskshop,
  updateClient,
  updateWorkshop,
  User,
  UserCart,
  UserLike,
  UserOrder,
  UserProduct,
  UserRequest,
  Users,
} from "../services/api";
import type {
  CreateClientParams,
  CreateWorkshopParams,
  QueryUserParams,
} from "@/features/request/types";

export const useUsers = (params?: QueryUserParams) => {
  return useQuery({
    queryKey: ["Users", params],
    queryFn: async () => {
      const response = await Users(params || {});
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useUserId = (id: number) => {
  return useQuery({
    queryKey: ["User", id],
    queryFn: async () => {
      const res = await User(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useUserOrders = (id: number) => {
  return useQuery({
    queryKey: ["UserOrders", id],
    queryFn: async () => {
      const res = await UserOrder(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useUserRequests = (id: number) => {
  return useQuery({
    queryKey: ["UserRequests", id],
    queryFn: async () => {
      const res = await UserRequest(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useUserLikes = (id: number) => {
  return useQuery({
    queryKey: ["UserLikes", id],
    queryFn: async () => {
      const res = await UserLike(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useUserCart = (id: number) => {
  return useQuery({
    queryKey: ["UserCart", id],
    queryFn: async () => {
      const res = await UserCart(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useUserProducts = (id: number) => {
  return useQuery({
    queryKey: ["UserProducts", id],
    queryFn: async () => {
      const res = await UserProduct(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};

export const useWorkshopUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateWorkshopParams;
    }) => {
      const response = await updateWorkshop(payload, id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    retry: false,
    onSuccess: () => {
      // Инвалидируем кеш после обновления workshop
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении мастерской:", error);
    },
  });
};

export const useClientUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateClientParams;
    }) => {
      const response = await updateClient(payload, id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    retry: false,
    onSuccess: () => {
      // Инвалидируем кеш после обновления клиента
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении клиента:", error);
    },
  });
};

export const useUserAcceptWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await AcceptWorskshop(id);
      if (!response.success) throw new Error(response.error);
      return { id };
    },
    onSuccess: (result) => {
      // 1. Обновляем список пользователей
      queryClient.invalidateQueries({ queryKey: ["Users"] });

      // 2. Обновляем данные конкретного пользователя, если открыта его карточка
      queryClient.invalidateQueries({ queryKey: ["User", result.id] });

      // 3. Если воркшопы отображаются в отдельных списках, их тоже стоит обновить
      queryClient.invalidateQueries({ queryKey: ["Workshops"] });
    },
    onError: (error) => {
      console.error("Ошибка при подтверждении воркшопа:", error);
    },
  });
};
