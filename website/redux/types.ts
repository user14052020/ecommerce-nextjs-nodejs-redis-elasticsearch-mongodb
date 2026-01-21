export const SWITCH_LANGUAGE = "SWITCH-LANGUAGE" as const;
export const SET_LOGIN = "SET_LOGIN" as const;
export const SET_ISAUTHENTICATED = "SET_ISAUTHENTICATED" as const;
export const SET_LOGOUT = "SET_LOGOUT" as const;
export const CHANGE_COLLAPSED = "CHANGE_COLLAPSED" as const;
export const GET_SETTINGS = "GET_SETTINGS" as const;
export const GET_ALL_FETCH_FAIL = "GET_ALL_FETCH_FAIL" as const;
export const BRANDS_FETCH = "BRANDS_FETCH" as const;
export const CATEGORIES_FETCH = "CATEGORIES_FETCH" as const;
export const FILTER_PRODUCTS = "FILTER_PRODUCTS" as const;
export const FILTER_RESET = "FILTER_RESET" as const;
export const BASKET_FETCH = "BASKET_FETCH" as const;
export const TOPMENU_FETCH = "TOPMENU_FETCH" as const;

export type GenericRecord = Record<string, unknown>;

export interface LanguageInfo {
  languageId: string;
  locale: string;
  name: string;
  icon: string;
}

export interface SettingsState {
  locale: LanguageInfo;
  collapsed: boolean;
  settings: GenericRecord;
  errorFetch: string;
}

export interface BrandsState {
  brands: GenericRecord[];
}

export interface CategoriesState {
  categories: GenericRecord[];
}

export interface TopmenuState {
  topmenu: GenericRecord[];
}

export interface FilterProductsPayload {
  brands: string[];
  categories: string[];
  text: string;
  variants: GenericRecord[];
  minPrice: number | null;
  maxPrice: number | null;
  sort?: GenericRecord | string;
  limit?: number;
  skip?: number;
}

export interface FilterProductsState {
  filterProducts: FilterProductsPayload;
}

export interface BasketItem {
  product_id: string;
  selectedVariants?: Record<string, string | number>;
  qty: number;
  seo: string;
}

export interface BasketAddress {
  type?: boolean;
  name?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  town_id?: string;
  district_id?: string;
  village_id?: string;
  address?: string;
}

export interface BasketEntry {
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
}

export interface BasketState {
  basket: BasketEntry[];
}

export interface LoginUser {
  id?: string;
  name?: string;
  address?: GenericRecord[];
  role: Record<string, boolean>;
  [key: string]: unknown;
}

export interface LoginState {
  user: LoginUser;
  isAuthenticated: boolean;
}

export interface SwitchLanguageAction {
  type: typeof SWITCH_LANGUAGE;
  payload: LanguageInfo;
}

export interface ChangeCollapsedAction {
  type: typeof CHANGE_COLLAPSED;
  payload: boolean;
}

export interface GetSettingsAction {
  type: typeof GET_SETTINGS;
  payload: GenericRecord;
}

export interface GetAllFetchFailAction {
  type: typeof GET_ALL_FETCH_FAIL;
  payload: string;
}

export interface BrandsFetchAction {
  type: typeof BRANDS_FETCH;
  payload: GenericRecord[];
}

export interface CategoriesFetchAction {
  type: typeof CATEGORIES_FETCH;
  payload: GenericRecord[];
}

export interface TopmenuFetchAction {
  type: typeof TOPMENU_FETCH;
  payload: GenericRecord[];
}

export interface FilterProductsAction {
  type: typeof FILTER_PRODUCTS;
  payload: FilterProductsPayload;
}

export interface FilterResetAction {
  type: typeof FILTER_RESET;
}

export interface BasketFetchAction {
  type: typeof BASKET_FETCH;
  payload: BasketState["basket"];
}

export interface SetLoginAction {
  type: typeof SET_LOGIN;
  payload: LoginUser;
}

export interface SetIsAuthenticatedAction {
  type: typeof SET_ISAUTHENTICATED;
  payload: boolean;
}

export interface SetLogoutAction {
  type: typeof SET_LOGOUT;
}

export type SettingsActions =
  | SwitchLanguageAction
  | ChangeCollapsedAction
  | GetSettingsAction
  | GetAllFetchFailAction;

export type BrandsActions = BrandsFetchAction;
export type CategoriesActions = CategoriesFetchAction;
export type TopmenuActions = TopmenuFetchAction;
export type FilterProductsActions = FilterProductsAction | FilterResetAction;
export type BasketActions = BasketFetchAction;
export type LoginActions = SetLoginAction | SetIsAuthenticatedAction | SetLogoutAction;

export type AppActions =
  | SettingsActions
  | BrandsActions
  | CategoriesActions
  | TopmenuActions
  | FilterProductsActions
  | BasketActions
  | LoginActions;
