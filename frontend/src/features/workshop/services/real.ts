import { clientApi, formDataApi } from "@/shared/client";

export async function getOrders() {
  try {
    const response = await clientApi.get(`/api/workshop/requests`);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error fetching dictionary:", error);
    throw error;
  }
}

export async function getOrderId(requestId: number) {
  try {
    const response = await clientApi.get(`/api/workshop/requests/${requestId}`);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

export async function updateOrder(requestId: number, formData?: FormData) {
  try {
    const client = formData ? formDataApi : clientApi;
    
    
    const response = await client.post(
      `/api/workshop/requests/${requestId}/nextStatus`,
      formData || {}
    );


    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {

    throw error;
  }
}


export async function postCode(requestId: number) {
  try {
    const response = await clientApi.post(`/api/workshop/requests/${requestId}/sendCodeToAcceptContract`);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}


export async function updateWorkShopAddition(requestId: number, idAdditions: number, code?: string) {
  try {
    const payload = code ? { code } : {};
    const response = await clientApi.post(`/api/workshop/requests/${requestId}/additions/${idAdditions}/nextStatus`, payload);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}