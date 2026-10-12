
export interface ICartOut {
  data: ICart[];
}

export interface ICart {
  id: number;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  price_product: number;
  price_result: number;
  quantity: number;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  media: Media[];
  created_at: string;
  categories: Category[];
  user_liked: boolean;
}

export interface Media {
  id: number;
  uuid: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
}

export interface Category {
  id: number;
  name: string;
}
