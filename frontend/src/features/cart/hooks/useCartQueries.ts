import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICartOut, ICartPostIn, ICartUpdateIn } from "../types";
import { IResponse } from "@/shared";
import { addCart, Carts, deleteCart, deleteItemCart, updateCart } from "../services";

// ==== GET CART ====
export const useCartQuery = () => {
  return useQuery<ICartOut>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await Carts();
      if (!response.success) throw new Error(response.error);
      return response.data;
    }
  });
};

// ==== ADD ITEM TO CART ====
export const useAddCart = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>, Error, ICartPostIn>({
    mutationFn: (payload) => addCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ==== UPDATE CART ITEM ====
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>, Error, ICartUpdateIn>({
    mutationFn: (payload) => updateCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ==== DELETE SINGLE ITEM ====
export const useDeleteItemCart = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>, Error, number>({
    mutationFn: (id) => deleteItemCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ==== CLEAR CART ====
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>, Error>({
    mutationFn: () => deleteCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
