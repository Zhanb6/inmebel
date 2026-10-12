import { clientApi } from "@/shared/services/client";

import type { QueryParams, RequestsResponse } from "../types";
import type { IResponse } from "@/shared/types";

export const Requests = (params: QueryParams): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/requests", { params });
};

export const Request = (id: number) =>
   clientApi.get(`/api/admin/requests/${id}`)

export const NextStatusRequest = (id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post(`/api/admin/requests/${id}/to_prev_status`);
};
