
import { useQuery } from "@tanstack/react-query";
import { Carts } from "../services";


export const useCartQuery = () => {
  return useQuery<any>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await Carts();
      if (!response.success) throw new Error(response.error);
      return response.data;
    }
  });
};