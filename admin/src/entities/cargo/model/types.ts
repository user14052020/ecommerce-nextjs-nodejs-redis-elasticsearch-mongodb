import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type CargoItem = {
  _id: string;
  title?: string;
  order?: number;
  image?: string;
  isActive?: boolean;
  price?: number;
  before_price?: number;
  link?: string;
  children?: unknown;
};

export type CargoFormValues = CargoItem & {
  image?: UploadChangeParam<UploadFile>;
};

export type CargoEditProps = {
  getData?: CargoItem;
};

export type CargoesListProps = {
  getData?: CargoItem[];
};
