import type { CreateClientParams, CreateWorkshopParams, QueryUserParams, RequestsResponse } from "@/features/request/types";
import { clientApi } from "@/shared/services/client";
import type { IResponse } from "@/shared/types";

export const Users = (params: QueryUserParams): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/users", { params });
};

export const User = (id: number) =>
   clientApi.get(`/api/admin/users/${id}`)

export const UserOrder = (id: number) =>
   clientApi.get(`api/admin/users/${id}/orders`)

export const UserRequest = (id: number) =>
   clientApi.get(`api/admin/users/${id}/requests`)

export const UserLike = (id: number) =>
   clientApi.get(`api/admin/users/${id}/products/liked`)

export const UserCart = (id: number) =>
   clientApi.get(`api/admin/users/${id}/cart`)

export const UserProduct = (id: number) =>
   clientApi.get(`api/admin/users/${id}/products`)

export const updateWorkshop = (payload: CreateWorkshopParams, id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post(`/api/admin/users/${id}/workshop/update`, payload);
};

export const updateClient = (payload: CreateClientParams, id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post(`/api/admin/users/${id}/client_data/update`, payload);
};

export const AcceptWorskshop = (id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post(`/api/admin/users/${id}/accept/workshop`);
};