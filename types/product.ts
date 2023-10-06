import { Image } from "./image";

export interface Product {
  _id: string;
  name: string;
  description: string;
  sizeId:string;
  category_ids:string[];
  price:number
  store_id: string;
  image_id: string[] | Image;
  isFeatured:boolean;
  isArchived:boolean;
  createdAt: Date;
  updatedAt: Date;
}

