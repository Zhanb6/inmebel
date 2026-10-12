export interface ICartPostIn {
  product_id: number;
  quantity: number;
}

export interface ICartUpdateIn {
  cart_item_id: number;
  quantity: number;
}