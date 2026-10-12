import { clientApi } from "@/shared/client";
import { IClientRequestIn } from "../../types";

export const createClientRequest = (payload: IClientRequestIn): Promise<any> =>
  clientApi.post("/api/client/requests", payload);

export const EditClientRequest = (payload: any, id: number): Promise<any> =>
  clientApi.post(`/api/client/requests/${id}/additions`, payload);

export async function getDictionary(dictName: string, params?: Record<string, any>) {
  try {
    const response = await clientApi.get(`/api/${dictName}`, { params });

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



export async function getPrice(payload: IClientRequestIn): Promise<any> {
  try {
    const response = await clientApi.post("/api/requests/getPrice", payload);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.error);
  } catch (error) {
    console.error("Error getting price:", error);
    throw error;
  }
}


export async function fillDictionaries() {
  try {
    const [
      furnitureSubtypes,
      frames,
      furnitureTypes,
      brands,
      facades,
      addons,
      addonsType,
      filling,
      workshops,
      kitchenTabletops,
      mirrorFrames,
      mirrorBacklights,
      mirrorForms,
      consoleTabletops,
    ] = await Promise.all([
      getDictionary("requests/furnitureSubtypes/list"),
      getDictionary("requests/frames/list"),
      getDictionary("requests/furnitureTypes/list"),
      getDictionary("requests/brands/list"),
      getDictionary("requests/facades/list"),
      getDictionary("requests/addons/list"),
      getDictionary("requests/addons/dataTypes/list"),
      getDictionary("requests/filling/list"),
      getDictionary("workshops/list"),
      getDictionary("requests/kitchenTabletops/list"),
      getDictionary("requests/mirror_frames/list"),
      getDictionary("requests/mirror_backlights/list"),
      getDictionary("requests/mirror_forms/list"),
      getDictionary("requests/console_tabletops/list"),
    ]);

return {
  furnitureSubtypes: Array.isArray(furnitureSubtypes)
    ? furnitureSubtypes
    : (furnitureSubtypes as any)?.data || [],

  frames: Array.isArray(frames)
    ? frames
    : (frames as any)?.data || [],

  furnitureTypes: Array.isArray(furnitureTypes)
    ? furnitureTypes
    : (furnitureTypes as any)?.data || [],

  brands: Array.isArray(brands)
    ? brands
    : (brands as any)?.data || [],

  facades: Array.isArray(facades)
    ? facades
    : (facades as any)?.data || [],

  addons: Array.isArray(addons)
    ? addons
    : (addons as any)?.data || [],

  addonsType: Array.isArray(addonsType)
    ? addonsType
    : (addonsType as any)?.data || [],

  filling: Array.isArray(filling)
    ? filling
    : (filling as any)?.data || [],

  workshops: Array.isArray(workshops)
    ? workshops
    : (workshops as any)?.data || [],

      kitchenTabletops: Array.isArray(kitchenTabletops)
    ? kitchenTabletops
    : (kitchenTabletops as any)?.data || [],

          mirrorFrames: Array.isArray(mirrorFrames)
    ? mirrorFrames
    : (mirrorFrames as any)?.data || [],
              mirrorBacklights: Array.isArray(mirrorBacklights)
    ? mirrorBacklights
    : (mirrorBacklights as any)?.data || [],
              mirrorForms: Array.isArray(mirrorForms)
    ? mirrorForms
    : (mirrorForms as any)?.data || [],
                  consoleTabletops: Array.isArray(consoleTabletops)
    ? consoleTabletops
    : (consoleTabletops as any)?.data || [],
};

  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    throw new Error("Не удалось загрузить словари");
  }
}



export async function getFacadesByType(furnitureTypeId?: number) {
  try {
    const facades = furnitureTypeId 
      ? await getDictionary("requests/facades/list", { furniture_type_id: furnitureTypeId })
      : await getDictionary("requests/facades/list");
    
    return Array.isArray(facades) ? facades : (facades as any)?.data || [];
  } catch (error) {
    console.error("Failed to load facades:", error);
    return [];
  }
}
