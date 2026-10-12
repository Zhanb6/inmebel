export interface QueryParams{
  page?: number;
  perPage?: number;
  search?: string;
}

export interface QueryUserParams {
  page?: number;
  perPage?: number;
  search?: string;
  role?: 'admin' | 'client' | 'workshop';
  workshop_accepted?: 0 | 1;
}

export interface CreateCategoriesParams{
 name: string;
 parent_category_id?: number; 
}

export interface CreateWorkshopParams {
  name: string;
  iin: string;
  address: string;
  description: string;
  bic: string;
  bank: string;
  director_name: string;
  iic: string;
  bc: string;
  city: string;
}

export interface CreateClientParams {
  iin: string;
  address: string;
}


export type RequestsResponse = {
  data: any[];
};