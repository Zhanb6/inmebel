import type { IResponse } from "../types";

export const mockResponse = {
  success<T>(data: T): IResponse<T> {
    return { success: true, data };
  },
  error<T = never>(message: string): IResponse<T> {
    return { success: false, error: message };
  },
};
