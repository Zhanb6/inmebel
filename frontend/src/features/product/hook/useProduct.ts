import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { IProductDetailData, IProductIn, IProductListItem, IProductPostIn, IProductResponse, IProductsOut } from "../types";
import { AnonimProducts, clientProducts, clientShowProduct, createProduct, deleteMediaProduct, deleteProduct, getLikeProduct, likeProduct, Products, showAnonimProduct, showProduct, starProduct, updateProduct } from "../services";
import { IResponse } from "@/shared";
import { TStarProductSchema } from "../lib";


export const useProductsQuery = (params: IProductIn, options?: any) => {
  return useQuery<IProductsOut>({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await Products(params);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    ...options, // передаем options сюда
  });
}

export const useAnonimProductsQuery = (params: IProductIn, options?: any) => {
  return useQuery<IProductsOut>({
    queryKey: ['anonim-products', params],
    queryFn: async () => {
      const response = await AnonimProducts(params);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    ...options, // передаем options сюда
  });
}
 
export const useShowProductQuery = (
  id: number,
  options?: any
) => {
  return useQuery<IProductResponse>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await showProduct(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    ...options, // передаем options сюда
  });
};

export const useShowAnonimProductQuery = (
  id: number,
  options?: any
) => {
  return useQuery<IProductResponse>({
    queryKey: ['anonim-product', id],
    queryFn: async () => {
      const response = await showAnonimProduct(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    ...options, // передаем options сюда
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>, Error, number>({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: (_, productId) => {
      // Инвалидируем кэш: список продуктов
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Инвалидируем кэш конкретного продукта
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    }
  });
};

export const useDeleteMediaProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, mediaId }: { productId: number; mediaId: number }) => 
      deleteMediaProduct(productId, mediaId),
    onSuccess: (_, variables) => {
      const { productId } = variables;
      // Инвалидируем кэш: список продуктов
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Инвалидируем кэш конкретного продукта
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    }
  });
};
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IResponse<null>,        
    Error,                 
    { formData: FormData }  
  >({
    mutationFn: ({ formData }) => createProduct(formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutation;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IResponse<null>,                // тип ответа
    Error,                          // тип ошибки
    { productId: number; formData: FormData } // данные для мутации
  >({
    mutationFn: ({ productId, formData }) => updateProduct(formData, productId),
    onSuccess: (_, { productId }) => {
      // Обновляем кэш списка продуктов
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Обновляем кэш конкретного продукта
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  return mutation;
};


export const useStarProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IResponse<null>,           // тип ответа
    Error,                     // тип ошибки
    { productId: number; payload: TStarProductSchema } // входящие данные
  >({
    mutationFn: ({ productId, payload }) => starProduct(productId, payload),

    onSuccess: (_, { productId }) => {

      // Обновляем конкретный продукт (его рейтинг и отзывы)
      queryClient.invalidateQueries({ queryKey: ["client-product", productId] });
    },
  });
};


export const useClientProductsQuery = (params: IProductIn, options?: any) => {
  return useQuery<IProductsOut>({
    queryKey: ['client-products', params],
    queryFn: async () => {
      const response = await clientProducts(params);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    ...options,
  });
}
 
export const useClientShowProductQuery = (
  id: number,
  options?: any
) => {
  return useQuery<IProductResponse>({
    queryKey: ['client-product', id],
    queryFn: async () => {
      const response = await clientShowProduct(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    ...options,
  });
};


// ==== GET LIKED PRODUCTS ====
export const useLikedProductsQuery = () => {
  return useQuery<IProductDetailData>({
    queryKey: ["liked-products"],
    queryFn: async () => {
      const response = await getLikeProduct();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });
};

// ==== TOGGLE LIKE ====
export const useLikeProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<IResponse<null>, Error, number>({
    mutationFn: (productId) => likeProduct(productId),
    onSuccess: (_, productId) => {
      // обновляем список лайкнутых товаров
      queryClient.invalidateQueries({ queryKey: ["liked-products"] });
      // обновляем клиентский список продуктов
      queryClient.invalidateQueries({ queryKey: ["client-products"] });
    },
  });
};