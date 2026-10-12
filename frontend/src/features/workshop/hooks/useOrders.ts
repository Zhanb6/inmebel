import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderId, getOrders, postCode, updateOrder, updateWorkShopAddition } from "../services/real";


export function useOrders() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  
  return { data, isPending, isError, error };
}

export function useOrderId(requestId: number) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["orders", requestId],
    queryFn: () => getOrderId(requestId),
  });
  
  return { data, isPending, isError, error };
}

export function useOrderUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ requestId, formData }: { requestId: number; formData?: FormData }) => 
      updateOrder(requestId, formData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["orders", variables.requestId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["orders"] 
      });
    },
  });
  
  return mutation;
} 


export function useWorkShopAdditionUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ requestId, idAdditions, code }: { requestId: number; idAdditions: number; code?: string }) => 
      updateWorkShopAddition(requestId, idAdditions, code),
    onSuccess: (data, variables) => {
      const requestId = variables.requestId;
      queryClient.invalidateQueries({ 
        queryKey: ["orders", requestId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["orders"] 
      });
    },
  });
  
  return mutation;
}

export function useSendCode() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (requestId: number) => postCode(requestId),
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ["some-related-query"] });
    },
    onError: (error) => {
      console.error("Error sending code:", error);
    }
  });

  return mutation;
}