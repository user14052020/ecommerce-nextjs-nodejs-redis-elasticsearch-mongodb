export type SelectOption = {
  label: string;
  value: string | null;
};

export type AddressEntry = {
  name: string;
  address: string;
  village_id?: string;
  district_id?: string;
  town_id?: string;
  city_id?: string;
};

export type CustomerItem = {
  _id: string;
  name: string;
  surname: string;
  username: string;
  phone: string;
  prefix: string;
  address: AddressEntry[];
};

export type VariantProduct = {
  price: number;
  before_price: number;
  qty: number | string;
  visible?: boolean;
  [key: string]: unknown;
};

export type OrderProductItem = {
  _id: string;
  seo: string;
  title: string;
  type?: boolean;
  categories_id?: string;
  price: number;
  before_price: number;
  variants?: { name: string; value: string[] }[];
  variant_products?: VariantProduct[];
  selectedVariants?: Record<string, string>;
  qty?: number;
};

export type CargoItem = {
  _id: string;
  title: string;
  price: number;
};

export type OrderFormState = {
  products: OrderProductItem[];
  discount_price: number;
  total_price: number;
  cargo_price: number;
  cargo_discount_price: number;
  cargoes_id?: string | null;
  customer_id?: string | null;
  billing_address?: string;
  shipping_address?: string;
  payment_intent?: string;
  orderstatus_id?: string;
  paymentmethods_id?: string;
};

export type OrderFormValues = {
  orderstatus_id: string;
  paymentmethods_id: string;
  cargoes_id: string;
  customer_id?: string | null;
  receiver_name: string;
  receiver_email: string;
  receiver_phone: string;
  billing_address: string;
  shipping_address: string;
};

export type PriceAdd = {
  before_price: number;
  price: number;
  qty: number;
};

export type OrderRecord = {
  _id: string;
  ordernumber: string;
  total_price: number;
  cargo_price: number;
  createdAt: string;
  image?: string;
  children?: unknown;
};

export type OrderStatus = {
  _id: string;
  title: string;
};

export type OrdersListProps = {
  getData?: OrderRecord[];
};
