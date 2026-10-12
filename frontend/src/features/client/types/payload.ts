export interface IClientRequestIn {
  furniture_type_id: number;
  address: string;
  description: string;
  furniture_subtype_id: number;
  frame_id: number;
  facade_id: number;
  facade_type_id: number;
  facade_color_id: number;
  brand_id: number;
  length: number;

  filling: {
    id: number;
    count: number;
  }[];

  addons?: {
    id: number;
    data_type: string;
    count: number;
    length: number;
  }[];
}
