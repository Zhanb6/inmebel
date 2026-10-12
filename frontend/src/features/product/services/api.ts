import { IResponse } from "@/shared";
import { clientApi, formDataApi } from "@/shared/client";
import { IAttributeList, ICategory, IProductDetailData, IProductIn, IProductListItem, IProductPostIn, IProductResponse, IProductsOut, Star } from "../types";

export const Products = (params: IProductIn): Promise<IResponse<IProductsOut>> =>
  clientApi.get<IProductsOut>('/api/workshop/products', {params})

export const AnonimProducts = (params: IProductIn): Promise<IResponse<IProductsOut>> =>
  clientApi.get<IProductsOut>('/api/products', {params})

export const showProduct = (productId: number): Promise<IResponse<IProductResponse>> =>
  clientApi.get<IProductResponse>(`/api/workshop/products/${productId}`);

export const showAnonimProduct = (productId: number): Promise<IResponse<IProductResponse>> =>
  clientApi.get<IProductResponse>(`/api/products/${productId}`);

export const deleteProduct = (productId: number): Promise<IResponse<null>> =>
  clientApi.delete(`/api/workshop/products/${productId}`)

export const deleteMediaProduct = (productId: number, mediaId: number): Promise<IResponse<null>> =>
  clientApi.delete(`/api/workshop/products/${productId}/media/${mediaId}`)

export const createProduct = (payload: FormData): Promise<IResponse<null>> => 
  formDataApi.post('/api/workshop/products', payload)

export const updateProduct = (payload: FormData, productId: number): Promise<IResponse<null>> => 
  formDataApi.post(`/api/workshop/products/${productId}`, payload)

export const starProduct = (productId: number, payload: Star): Promise<IResponse<null>> =>
  clientApi.post(`/api/client/products/${productId}/review`, payload)

export const clientProducts = (params: IProductIn): Promise<IResponse<IProductsOut>> =>
  clientApi.get<IProductsOut>('/api/products', {params})

export const clientShowProduct = (productId: number): Promise<IResponse<IProductResponse>> =>
  clientApi.get<IProductResponse>(`/api/products/${productId}`);

export const likeProduct = (productId: number): Promise<IResponse<null>> =>
  clientApi.post(`/api/client/products/${productId}/like/toggle`)

export const getLikeProduct = (): Promise<IResponse<IProductDetailData>> =>
   clientApi.get<IProductDetailData>('/api/client/products/liked')

export async function getDictionary(dictName: string) {
  try {
    const response = await clientApi.get(`/api/${dictName}`);

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

export async function fillDictionaries() {
  try {
    const [categoriesRes, attributesRes] = await Promise.all([
      getDictionary("categories/list"),
      getDictionary("attributes/list"),
    ]);

    // Преобразуем категории
    const categories = Array.isArray((categoriesRes as any)?.data)
      ? (categoriesRes as any).data
      : Array.isArray(categoriesRes)
      ? categoriesRes
      : [];

    // Преобразуем атрибуты, добавляем category_ids
    const attributes = (Array.isArray((attributesRes as any)?.data)
      ? (attributesRes as any).data
      : Array.isArray(attributesRes)
      ? attributesRes
      : []
    ).map((attr: any) => ({
      ...attr,
      category_ids: attr.categories ? attr.categories.map((cat: any) => cat.id) : [],
    }));

    return {
      categories,
      attributes,
    };
  } catch (error) {
    console.error("Failed to load dictionaries:", error);
    throw new Error("Не удалось загрузить словари");
  }
}