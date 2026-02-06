import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type BrandItem = {
  _id: string;
  title?: string;
  order?: number;
  description?: string;
  seo?: string;
  image?: string;
  isActive?: boolean;
  children?: unknown;
  [key: string]: unknown;
};

export type BrandFormValues = BrandItem & {
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

export type BrandEditProps = {
  getData?: BrandItem;
};

export type BrandsListProps = {
  getData?: BrandItem[];
};
