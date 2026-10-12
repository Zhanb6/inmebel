/*
 * Copyright (c) 2025. Damirka
 */
"use client"


import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import { IClientRequestIn } from "../types";
import { createClientRequest } from "../services/client";
import { EditClientRequest } from "../services/client/real";


export const useClientRequesMutation = () => {
  return useMutation({
    mutationFn: async (payload: IClientRequestIn) => {
      const response = await createClientRequest(payload);
      if (!response.success) throw new Error(response.errors);
      return response.data;
    },
    retry: false,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};


export const useEditClientRequestMutation = (
  id: number | undefined,
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
  }
) => {
  return useMutation({
    mutationFn: async (payload: any) => {
      if (!id || isNaN(id)) {
        throw new Error("ID заявки не указан или невалиден");
      }
      
      const response = await EditClientRequest(payload, id);
      if (!response.success) throw new Error(response.errors);
      return response.data;
    },
    retry: false,
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(error.message);
      options?.onError?.(error);
    },
  });
};