import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFurniture, getFurnitureId, postCode, updateFurniture, updateFurnitureAddition } from "../services/real";
import { clientApi } from "@/shared/client";


export function useFurniture() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["furniture"],
    queryFn: getFurniture,
  });
  
  return { data, isPending, isError, error };
}

export function useFurnitureId(requestId: number, options?: { enabled?: boolean }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["furniture", requestId],
    queryFn: () => getFurnitureId(requestId),
    enabled: options?.enabled ?? true, 
  });
  
  return { data, isPending, isError, error };
}


export function useFurnitureUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ requestId, code }: { requestId: number; code?: string }) => 
      updateFurniture(requestId, code),
    onSuccess: (data, variables) => {
      const requestId = variables.requestId;
      queryClient.invalidateQueries({ 
        queryKey: ["furniture", requestId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["furniture"] 
      });
    },
  });
  
  return mutation;
}

export function useFurnitureAdditionUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ requestId, idAdditions, code }: { requestId: number; idAdditions: number; code?: string }) => 
      updateFurnitureAddition(requestId, idAdditions, code),
    onSuccess: (data, variables) => {
      const requestId = variables.requestId;
      queryClient.invalidateQueries({ 
        queryKey: ["furniture", requestId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["furniture"] 
      });
    },
  });
  
  return mutation;
}

export function useFurnitureUsagePdf(requestId: number) {
  const queryClient = useQueryClient();
  
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["furniture-usage", requestId],
    queryFn: async () => {
      try {
        const response = await clientApi.get(`/api/furniture_usage`, {
          params: { request_id: requestId },
          responseType: 'blob'
        });

        if (response.success) {
          // Type assertion for the blob data
          return URL.createObjectURL(response.data as Blob);
        } else {
          throw new Error(response.error as string);
        }
      } catch (error) {
        console.error("Error fetching furniture usage PDF:", error);
        throw error;
      }
    },
    enabled: false,
  });
  
  return { data, isPending, isError, error, refetch };
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