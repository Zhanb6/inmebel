import { clientApi, IResponse } from "@/shared/client";
import { ICartOut, ICartPostIn, ICartUpdateIn } from "../types";

export const Carts = (): Promise<IResponse<ICartOut>> =>
   clientApi.get<ICartOut>('/api/client/cart')

export const addCart = (payload: ICartPostIn): Promise<IResponse<null>> =>
  clientApi.post(`/api/client/cart/add`, payload)

export const updateCart = (payload: ICartUpdateIn): Promise<IResponse<null>> =>
  clientApi.put(`/api/client/cart`, payload)

export const deleteItemCart = (id: number): Promise<IResponse<null>> =>
  clientApi.delete(`/api/client/cart/items/${id}`)

export const deleteCart = (): Promise<IResponse<null>> =>
  clientApi.delete(`/api/client/cart/items/clear`)

 