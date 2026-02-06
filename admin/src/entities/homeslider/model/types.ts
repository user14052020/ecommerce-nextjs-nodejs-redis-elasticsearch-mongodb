import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type TreeOption = {
  label?: string;
  value?: string;
  children?: TreeOption[];
};

export type HomeSliderItem = {
  _id?: string;
  categories_id?: string;
  order?: number;
  title?: string;
  description?: string;
  link?: string;
  image?: string;
  isActive?: boolean;
  children?: unknown;
};

export type HomeSliderFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description?: string;
  link?: string;
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

export type HomeSliderAddProps = {
  getCategories?: TreeOption[];
};

export type HomeSliderEditProps = {
  getData?: HomeSliderItem;
  getCategories?: TreeOption[];
};

export type HomeSliderListProps = {
  getData?: HomeSliderItem[];
};
