import type { QueryParams, RequestsResponse } from "@/features/request/types";
import { clientApi } from "@/shared/services/client";


import type { IResponse } from "@/shared/types";

export const Orders = (params: QueryParams): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/orders", { params });
};

export const Order = (id: number) =>
   clientApi.get(`/api/admin/orders/${id}`)

export const NextStatusOrders = (id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post(`/api/admin/orders/${id}/to_prev_status`);
};