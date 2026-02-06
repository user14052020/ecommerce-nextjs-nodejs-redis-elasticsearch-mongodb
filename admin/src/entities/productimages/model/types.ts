import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type SelectOption = {
  label: string;
  value: string | null;
};

export type ProductRef = {
  _id: string;
  title?: string;
};

export type ProductImageItem = {
  _id?: string;
  order?: number;
  title?: string;
  image?: string;
  product_id?: ProductRef | string | null;
  children?: unknown;
};

export type ProductImageFormValues = {
  product_id?: string | null;
  order?: number;
  title?: string;
  image?: UploadChangeParam<UploadFile>;
};

export type ProductImageBatchItem = {
  order: number;
  title?: string;
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
  product_id?: string | null;
};

export type ProductImagesFormValues = {
  product_id?: string | null;
  arrayImage: ProductImageBatchItem[];
};

export type ProductImagesListProps = {
  getData?: ProductImageItem[];
};

export type ProductImagesAddProps = {
  getProducts?: SelectOption[];
};

export type ProductImagesEditProps = {
  getProducts?: SelectOption[];
  getData?: ProductImageItem;
};
