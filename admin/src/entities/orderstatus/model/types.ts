import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type OrderStatusItem = {
  _id?: string;
  title?: string;
  order?: number;
  image?: string;
  children?: unknown;
};

export type OrderStatusFormValues = {
  order: number;
  title: string;
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

export type OrderStatusListProps = {
  getData?: OrderStatusItem[];
};

export type OrderStatusEditProps = {
  getData?: OrderStatusItem;
};
