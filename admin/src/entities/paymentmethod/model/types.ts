import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type ApiItem = {
  name?: string;
  value?: string;
};

export type PaymentMethodItem = {
  _id?: string;
  order?: number;
  title?: string;
  contract?: string;
  public_key?: string;
  secret_key?: string;
  api?: ApiItem[];
  image?: string;
  isActive?: boolean;
  children?: unknown;
};

export type PaymentMethodFormValues = {
  order: number;
  title: string;
  contract: string;
  public_key: string;
  secret_key: string;
  api?: ApiItem[];
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

export type PaymentMethodsListProps = {
  getData?: PaymentMethodItem[];
};

export type PaymentMethodsEditProps = {
  getData?: PaymentMethodItem;
};
