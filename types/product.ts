import { Image } from "./image";

export interface Product {
  _id: string;
  name: string;
  description: string;
  size_ids: string[];
  category_ids: string[];
  price: number;
  store_id: string;
  image_ids: string[] | Image;
  is_featured: boolean;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}
