import type { QueryParams } from "@/features/request/types";
import { useQuery } from "@tanstack/react-query";
import { Product, Products } from "../services/api";

export const useProducts = (params?: QueryParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await Products(params || {});
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useProductId = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await Product(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
};
