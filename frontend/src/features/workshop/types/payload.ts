export interface IWorkshopRequestIn {
  id: number
  address: string
  price_from: string
  price_to: string
  furniture_type: {
    id: number
    name: string
  }
  request_status: {
    id: number
    name: string
  }
  created_at: string
}


export interface FurnitureAddon {
  id: number;
  furniture_addon: string;
  count: number;
  length: number;
}

export interface FurnitureFilling {
  id: number;
  name: string;
  count: number;
}

export interface Media {
  id: number;
  uuid: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
  preview_url: string;
}

export interface FurnitureOption {
  id: number;
  name: string;
  media?: Media;
}

export interface FurnitureData {
  frame?: { name: string };
  facade?: { name: string };
  facade_type?: FurnitureOption;
  facade_color?: FurnitureOption;
  brand?: { name: string };
  length?: number;
  height?: number;
  addons?: FurnitureAddon[];
  filling?: FurnitureFilling[];
}

export interface Status {
  id: number;
  name: string;
  passed_at: string | null;
  media?: any;

}

export interface Order {
  id: number;
  address: string;
  request_status: { id: number; name: string; };
  furniture_type: { name: string; id: number; };
  created_at: string;
  price_from: number;
  price_to: number;
  price?: number; 
  furniture_data: FurnitureData;
  statuses: {
    data: Status[];
      next_status: {
    can: boolean;
  }
  };
  workshop_id: number;
  additions: any[];
}
