import { clientApi } from "@/shared/client";

export async function getFurniture() {
  try {
    const response = await clientApi.get(`/api/client/requests`);

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


export async function getFurnitureId(requestId: number) {
  try {
    const response = await clientApi.get(`/api/client/requests/${requestId}`);

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

export async function updateFurniture(requestId: number, code?: string) {
  try {
    const payload = code ? { code } : {};
    const response = await clientApi.post(`/api/client/requests/${requestId}/nextStatus`, payload);

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

export async function updateFurnitureAddition(requestId: number, idAdditions: number, code?: string) {
  try {
    const payload = code ? { code } : {};
    const response = await clientApi.post(`/api/client/requests/${requestId}/additions/${idAdditions}/nextStatus`, payload);

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


export async function postCode(requestId: number) {
  try {
    const response = await clientApi.post(`/api/client/requests/${requestId}/sendCodeToAcceptContract`);

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