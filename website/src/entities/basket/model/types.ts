export const BASKET_FETCH = "BASKET_FETCH" as const;

export type BasketItem = {
  product_id: string;
  selectedVariants?: Record<string, string | number>;
  qty: number;
  seo: string;
};

export type BasketAddress = {
  type?: boolean;
  name?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  town_id?: string;
  district_id?: string;
  village_id?: string;
  address?: string;
};

export type BasketEntry = {
  _id?: string;
  created_user?: { name?: string; id?: string };
  customer_id?: string | null;
  receiver_name?: string;
  receiver_email?: string;
  receiver_phone?: string;
  cargoes_id?: string | null;
  total_price?: number;
  total_discount?: number;
  cargo_price?: number;
  cargo_price_discount?: number;
  payment_intent?: string;
  shipping_address?: BasketAddress;
  billing_address?: BasketAddress;
  products: BasketItem[];
};

export type BasketState = {
  basket: BasketEntry[];
};

export type BasketFetchAction = {
  type: typeof BASKET_FETCH;
  payload: BasketState["basket"];
};

export type BasketActions = BasketFetchAction;

export type BasketProduct = BasketItem;

export type VariantProduct = {
  price: number;
  before_price: number;
  qty: number;
  visible?: boolean;
};

export type ProductData = {
  _id: string;
  isActive?: boolean;
  qty?: number;
  price: number;
  before_price: number;
  variant_products?: VariantProduct[];
};

export type CargoItem = {
  _id: string;
  price: number;
  before_price: number;
  title?: string;
};

export type SelectedCargo = {
  cargo_price_discount: number;
  cargo_price: number;
  selectedCargo: string | null;
};

export type AllPrice<TError = boolean> = {
  total: number;
  discount: number;
  cargo_price: number;
  cargo_price_discount: number;
  error?: TError[];
};
