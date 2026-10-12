// Базовый интерфейс продукта
export interface IProductBase {
  id: number;
  name: string;
  price: number;
  description: string;
  media: any[];
  created_at: string;
  categories: ICategory[];
  user_liked?: boolean;
  reviews_avg_star: number;
  reviews_count: number;
  reviews_with_comment_count: number;
}

// Интерфейс продукта для списка

// export interface IProductListItem extends IProductBase {}

// Интерфейс ответа для списка продуктов с пагинацией
export interface IProductsOut {
  data: IProductBase[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

// Интерфейс продукта для одного запроса (детальный)
export interface IProductDetail extends IProductBase {
  reviews: any[];
  reviews_avg_star: number;
  reviews_count: number;
  attributes: IAttribute[];
}

// Интерфейс ответа для одного продукта
export interface IProductResponse {
  data: IProductDetail;
}

// Категории
export interface ICategory {
  id: number;
  name: string;
  parent_category_id?: number;
}

// Атрибуты
export interface IAttribute {
  id: number;
  attribute_id: number;
  attribute: string;
  attribute_type: 'integer' | 'select' | string;
  value: string | null;
  variants: IVariant[];
}

export interface IAttributeList {
  id: number;
  name: string;
  type: IType;
  variants: IVariant[];
  categories: ICategory[];
}

export interface IVariant {
  id: number;
  value: string;
}

// Пагинация
export interface IPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface IPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: IPaginationMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface IPaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}


export type IType = 'Integer' | 'Boolean' | 'Text' | 'Select';


export interface IProductListItem {
  id: number;
  name: string;
  price: number;
  description: string | null;
  media: {
    id: number;
    uuid: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
  }[];
  created_at: string;
  categories: {
    id: number;
    name: string;
    parent_category_id?: number | null;
  }[];
}


// Общий тип для ответов продуктов
export type IProductsResponse = IProductsOut | { data: IProductListItem[]; meta: IPaginationMeta; links: IPaginationLinks };


// Общий тип для отдельного продукта (для использования в компонентах)
export type ICommonProduct = (IProductBase | IProductListItem) & {
  media: Array<{
    id: number;
    original_url: string;
    file_name?: string;
    mime_type?: string;
    size?: number;
    uuid?: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    parent_category_id?: number | null;
  }>;
};

// Общий тип для пагинированного ответа продуктов
export interface ICommonProductsResponse {
  data: ICommonProduct[];
  meta: IPaginationMeta;
  links: IPaginationLinks;
}

interface IReview {
  id: number;
  star: number;
  comment: string;
  person_name: string;
}

// Детальный тип продукта для страницы продукта
export interface IProductDetailData {
  id: number;
  name: string;
  price: number;
  description: string;
  media: Array<{
    id: number;
    uuid: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
  }>;
  created_at: string;
  reviews: IReview[];
  categories: ICategory[];
  attributes: any[];
  user_liked?: boolean;
}

// Ответ для детальной страницы продукта
export interface IProductDetailResponse {
  data: IProductDetailData;
}