export interface IProductIn {
  page: number;
  perPage: number;
  search: string;

  category_ids?: number[]; 
  
  attributes?: {
    id?: number;               
    value?: string;              
    attribute_variant_ids?: number[]; 
  }[];
}


export interface IProductShowIn {
  productId: number;
}

export interface IProductPostIn {
  name: string;
  price: string; 
  images: any; 
  categories: number[];
  attributes?: {
    id: number;
    value?: string;
    attribute_variant_ids?: number[];
  }[];
}

export interface Star {
  star: string;
  comment: string;
}