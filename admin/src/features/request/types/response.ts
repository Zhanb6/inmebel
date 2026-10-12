export interface RequestResponse {
  data: Request[];
  links: Links;
  meta: Meta;
}

export interface Request {
  id: number;
  client_name: string;
  client_iin: string;
  client_phone: string;
  client_address: string;
  price: string; // если нужно работать с числами, можно заменить на number
  workshop_id: number;
  workshop: Workshop;
  furniture_type: FurnitureType;
  request_status: RequestStatus;
  created_at: string; // или Date, если конвертировать
}

export interface Workshop {
  id: number;
  name: string;
}

export interface FurnitureType {
  id: number;
  name: string;
}

export interface RequestStatus {
  id: number;
  name: string;
}

export interface Links {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface MetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}





export interface OneRequestResponse {
  data: OneRequest;
}

export interface OneRequest {
  id: number;
  address: string | null;
  price_from: string;
  price_to: string;
  price: string;
  workshop_id: number;
  workshop: Workshop;
  furniture_type: FurnitureType;
  request_status: RequestStatus;
  request_status_id: number;
  created_at: string;
  furniture_data: FurnitureData;
  statuses: Statuses;
  client_name: string;
  client_iin: string;
  client_phone: string;
  client_address: string;
}

export interface Workshop {
  id: number;
  name: string;
}

export interface FurnitureType {
  id: number;
  name: string;
}

export interface RequestStatus {
  id: number;
  name: string;
}

export interface FurnitureData {
  id: number;
  type: FurnitureDataType;
  frame: FurnitureDataBase;
  facade: FurnitureDataBase;
  facade_type: FurnitureFacadeType;
  facade_color: FurnitureFacadeColor;
  brand: FurnitureDataBase;
  addons: any[];     // если появится структура — уточним
  filling: any[];    // если появится структура — уточним
  length: number | null;
}

export interface FurnitureDataType {
  id: number;
  name: string;
  media: MediaItem | null;
}

export interface FurnitureDataBase {
  id: number;
  name: string;
}

export interface FurnitureFacadeType {
  id: number;
  name: string;
  media: MediaItem | null;
}

export interface FurnitureFacadeColor {
  id: number;
  name: string;
  code: string;
  media: MediaItem | null;
}

export interface MediaItem {
  id: number;
  uuid: string;
  file_name: string;
  mime_type: string;
  size: number;
  original_url: string;
  signatures_url: string | null;
}

export interface Statuses {
  next_status: NextStatus;
  data: StatusItem[];
}

export interface NextStatus {
  id: number;
  name: string;
  can: boolean;
}

export interface StatusItem {
  id: number;
  name: string;
  passed_at: string | null;
  comment: string | null;
  media: MediaItem[];
}
