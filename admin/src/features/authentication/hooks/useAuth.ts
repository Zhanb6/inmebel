import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../services";


const QUERY_KEYS = {
  session: ["session"],
  profile: ["profile"],
};

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const accessToken = await login(payload); 
      return accessToken;
    },
    retry: false,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile }),
      ]);
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
    },
  });
}
