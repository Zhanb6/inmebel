import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getClientInfo, getProfile, getWorkshopInfo, logoutProfile, updateClientInfo, updateWorkshopInfo } from "../services"

export const useProfileQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const response = await getProfile();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: options?.enabled, // Передаем enabled опционально
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logoutProfile,
    onSuccess: () => {
      queryClient.setQueryData(['profile'], null);
      queryClient.removeQueries({ queryKey: ['profile'] });
    }
  });
}

export const useWorkshopInfoQuery = () => {
  return useQuery({
    queryKey: ['workshopInfo'],
    queryFn: async () => {
      const response = await getWorkshopInfo();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
}

// Хук для обновления информации о мастерской
export const useUpdateWorkshopMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateWorkshopInfo,
    onSuccess: (data) => {
      // Обновляем кэш с новой информацией
      queryClient.setQueryData(['workshopInfo'], data);
      // Или инвалидируем запрос для гарантии свежих данных
      queryClient.invalidateQueries({ queryKey: ['workshopInfo'] });
    },
    onError: (error: Error) => {
      console.error('Ошибка при обновлении мастерской:', error);
    }
  });
}


export const useClientInfoQuery = () => {
  return useQuery({
    queryKey: ['clientInfo'],
    queryFn: async () => {
      const response = await getClientInfo();
      return response;
    },

  });
};

export const useUpdateClientInfoMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateClientInfo,
    onSuccess: (data) => {
      // Обновляем кэш с новой информацией
      queryClient.setQueryData(['clientInfo'], data);
      // Или инвалидируем запрос для гарантии свежих данных
      queryClient.invalidateQueries({ queryKey: ['clientInfo'] });
    },
    onError: (error: Error) => {
      console.error('Ошибка при обновлении информации о клиенте:', error);
    }
  });
};
