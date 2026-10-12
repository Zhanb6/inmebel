import { clientApi } from "@/shared/services/client";
import type { IResponse } from "@/shared/types";

export const Carts = (): Promise<IResponse<any>> =>
   clientApi.get<any>('/api/admin/dashboard')