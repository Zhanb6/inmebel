import { clientApi, IResponse } from "@/shared/client";
import { ProfileResponse } from "../types";

export interface WorkshopInfo {
  id: number;
  name: string;
  iin: string;
  address: string;
  description: string;
  bic: string;
  bank: string;
  director_name: string;
  iic: string;
  bc: string;
  city: string;
  media: any[];
}

export interface WorkshopUpdateRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  director_name?: string;
}

export interface ClientInfo {

  address?: string;
  iin?: string;

}



export const getProfile = (): Promise<IResponse<ProfileResponse>> =>
  clientApi.get<ProfileResponse>('/api/me');

export const logoutProfile = () => clientApi.post('/api/logout');


export const getWorkshopInfo = (): Promise<any> =>
  clientApi.get<any>('/api/workshop/info');


export const updateWorkshopInfo = (data: any): Promise<any> =>
  clientApi.post<any>('/api/workshop/info', data);

export const getClientInfo = (): Promise<any> =>
  clientApi.get<any>('/api/client/info');

export const updateClientInfo = (data: any): Promise<any> =>
  clientApi.post<any>('/api/client/info', data);