export type TreeOption = {
  label?: string;
  value?: string;
  children?: TreeOption[];
  disabled?: boolean;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type VariantValue = {
  name: string;
  value: string;
};

export type VariantDefinition = {
  name: string;
  variants: VariantValue[];
};

export type VariantOptionsState = {
  options: SelectOption[];
  data: VariantDefinition[];
};

export type VariantValueOptionsState = {
  options: SelectOption[][];
};

export type VariantMetaField = {
  key: string;
  initialValue: string;
  display?: boolean;
  label?: string;
  fieldKey?: string | number;
};

export type ProductFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  visible?: boolean;
  before_price?: number;
  price?: number;
  qty?: number;
  saleqty?: number;
  brands_id?: string;
  type?: boolean;
  variants?: { name?: string; value?: string[] }[];
  variant_products?: Record<string, unknown>[];
  isActive?: boolean;
  created_user?: { name?: string; id?: string };
};

export type ProductsAddProps = {
  getCategories?: TreeOption[];
};

export type ProductsEditProps = {
  getCategories?: TreeOption[];
  getData?: ProductFormValues;
};

export type VariantPriceItem = {
  price: number;
};

export type ProductItem = {
  _id: string;
  title?: string;
  price?: number;
  type?: boolean;
  variant_products?: VariantPriceItem[];
};

export type ProductsListProps = {
  getData?: ProductItem[];
};
