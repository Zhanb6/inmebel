import { clientApi, IResponse } from "@/shared/client";
import { IOrderOut, IOrderOutShow } from "../types";

export const Orders = (): Promise<IResponse<IOrderOut>> =>
   clientApi.get<IOrderOut>('/api/client/orders')

export const Order = (id: number): Promise<IResponse<IOrderOutShow>> =>
   clientApi.get<IOrderOutShow>(`/api/client/orders/${id}`)

export const CreateOrders = (): Promise<IResponse<null>> =>
  clientApi.get('/api/client/orders/make');

export const WorkshopOrders = (): Promise<IResponse<IOrderOut>> =>
   clientApi.get<IOrderOut>('/api/workshop/orders')

export const WorkshopOrder = (id: number): Promise<IResponse<IOrderOutShow>> =>
   clientApi.get<IOrderOutShow>(`/api/workshop/orders/${id}`)

export const addWorkshopOrder = (id: number): Promise<IResponse<null>> =>
  clientApi.post(`/api/workshop/orders/${id}/nextStatus`)