import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

export type SettingValueItem = {
  name?: string;
  value?: string;
};

export type SettingState = {
  company?: string;
  taxnumber?: number;
  taxcenter?: string;
  website?: string;
  title?: string;
  description?: string;
  keywords?: string;
  price_icon?: string;
  price_type?: boolean;
  image?: string;
  email?: SettingValueItem[];
  address?: SettingValueItem[];
  phone?: SettingValueItem[];
};

export type SettingFormValues = SettingState & {
  image?: UploadChangeParam<UploadFile>;
};

export type SettingItem = {
  _id: string;
  title?: string;
  company?: string;
};
