
import { tokenStore } from "@/shared";
import { clientApi } from "@/shared/services/client";
import type { AuthResponse } from "../types";


export const login = async (payload: any): Promise<AuthResponse> => {
  const response = await clientApi.post<AuthResponse>("/api/login", payload);

  if (!response.success) {
    throw new Error(response.error);
  }
  const authData = response.data;
  tokenStore.set(authData.access_token.token); 

  return authData;
};
