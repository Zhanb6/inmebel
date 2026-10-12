import type { CreateCategoriesParams, QueryParams, RequestsResponse } from "@/features/request/types";
import { clientApi } from "@/shared/services/client";
import type { IResponse } from "@/shared/types";

export const Categories = (params: QueryParams): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/categories", { params });
};

export const Category = (id: number) =>
   clientApi.get(`/api/admin/categories/${id}`)

export const CreateCategories = (payload: CreateCategoriesParams): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post("/api/admin/categories", payload);
};

export const UpdateCategories = (payload: CreateCategoriesParams, id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.put(`/api/admin/categories/${id}`, payload);
};

export const DeletCategory = (id: number) =>
   clientApi.delete(`/api/admin/categories/${id}`)

export const Attributes = (): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/attributes");
};

export const Attribute = (id: number) =>
   clientApi.get(`/api/admin/attributes/${id}`)

export const AttributesList = (): Promise<IResponse<RequestsResponse>> => {
  return clientApi.get("/api/admin/attributes/list");
};

export const CreateAttributes = (payload: any): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post("/api/admin/attributes", payload);
};

export const UpdateAttributes = (payload: any, id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.put(`/api/admin/attributes/${id}`, payload);
};

export const UpdateVariants = (payload: any, id: number, variantId: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.put(`/api/admin/attributes/${id}/variants/${variantId}`, payload);
};
export const CreateVariants = (payload: any, id: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.post(`/api/admin/attributes/${id}/variants`, payload);
};
export const DelteVariants = (payload: any, id: number, variantId: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.delete(`/api/admin/attributes/${id}/variants/${variantId}`, payload);
};
export const DeletAttribute = (id: number) =>
   clientApi.delete(`/api/admin/attributes/${id}`)


export const AttachAtribute = (payload: any, id: number, attributeId: number): Promise<IResponse<RequestsResponse>> => {
  return clientApi.put(`/api/admin/categories/${id}/attributes/${attributeId}`, payload);
};
