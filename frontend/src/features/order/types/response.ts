export interface IOrderOut {
  data: IOrder[];
}

export interface IOrder {
  id: number;
  workshop: IWorkshop;
  order_status: IOrderStatus;
  price: string;
  products: IProduct[];
}

export interface IWorkshop {
  id: number;
  name: string;
  iin: string;
  address: string;
  media: IMedia[];
}

export interface IOrderStatus {
  id: number;
  name: string;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  media: IMedia[];
  created_at: string;
  reviews: IReview[];
  categories: ICategory[];
  attributes: IAttribute[];
  user_liked: boolean;
  pivot: IPivot;
}

export interface IMedia {
  id: number;
  uuid: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
}

export interface IReview {
  id: number;
  star: string;
  comment: string;
  person_name: string;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IAttribute {
  id: number;
  attribute_id: number;
  attribute: string;
  attribute_type: "integer" | "select" | string;
  value: string | null;
  variants: IVariant[];
}

export interface IVariant {
  id: number;
  value: string;
}

export interface IPivot {
  price: string;
  quantity: number;
}


export interface IOrderOutShow {
  data: IOrderShow;
}

export interface IOrderShow extends IOrder {
  statuses: IStatuses;
}

export interface IStatuses {
  next_status: INextStatus;
  data: IStatusHistory[];
}

export interface INextStatus {
  id: number | null;
  name: string | null;
}

export interface IStatusHistory {
  id: number;
  name: string;
  passed_at: string;
}
