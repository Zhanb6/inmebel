import type { QueryParams, RequestsResponse } from "@/features/request/types";
import { clientApi } from "@/shared/services/client";


import type { IResponse } from "@/shared/types";

export const Products = (params: QueryParams): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/products", { params });
};

export const Product = (id: number) =>
   clientApi.get(`/api/admin/products/${id}`)