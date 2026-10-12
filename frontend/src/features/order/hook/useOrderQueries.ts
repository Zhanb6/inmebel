"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Orders,
  Order,
  CreateOrders,
  WorkshopOrders,
  WorkshopOrder,
  addWorkshopOrder
} from "../services";
import { IOrderOut, IOrderOutShow } from "../types";
import { IResponse } from "@/shared";

// =======================
// CLIENT ORDERS
// =======================

// ---- GET CLIENT ORDERS LIST ----
export const useOrdersQuery = () => {
  return useQuery<IOrderOut>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await Orders();
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  });
};

// ---- GET ONE CLIENT ORDER ----
export const useOrderQuery = (id: number) => {
  return useQuery<IOrderOutShow>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const res = await Order(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  });
};

// ---- CREATE ORDER (client /make) ----
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>>({
    mutationFn: () => CreateOrders(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};

// =======================
// WORKSHOP ORDERS
// =======================

// ---- GET WORKSHOP ORDERS ----
export const useWorkshopOrdersQuery = () => {
  return useQuery<IOrderOut>({
    queryKey: ["workshop-orders"],
    queryFn: async () => {
      const res = await WorkshopOrders();
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  });
};

// ---- GET ONE WORKSHOP ORDER ----
export const useWorkshopOrderQuery = (id: number) => {
  return useQuery<IOrderOutShow>({
    queryKey: ["workshop-orders", id],
    queryFn: async () => {
      const res = await WorkshopOrder(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  });
};

// ---- UPDATE WORKSHOP ORDER STATUS (nextStatus) ----
export const useNextWorkshopOrderStatus = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>>({
    mutationFn: () => addWorkshopOrder(id),
    onSuccess: () => {
      // обновляем список + конкретный заказ
      queryClient.invalidateQueries({ queryKey: ["workshop-orders"] });
      queryClient.invalidateQueries({ queryKey: ["workshop-orders", id] });
    }
  });
};
