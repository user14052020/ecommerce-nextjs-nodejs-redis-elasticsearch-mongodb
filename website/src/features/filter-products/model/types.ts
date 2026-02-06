import type { GenericRecord } from "@root/shared/types/common";

export const FILTER_PRODUCTS = "FILTER_PRODUCTS" as const;
export const FILTER_RESET = "FILTER_RESET" as const;

export type FilterProductsPayload = {
  brands: string[];
  categories: string[];
  text: string;
  variants: GenericRecord[];
  minPrice: number | null;
  maxPrice: number | null;
  sort?: GenericRecord | string;
  limit?: number;
  skip?: number;
};

export type FilterProductsState = {
  filterProducts: FilterProductsPayload;
};

export type FilterProductsAction = {
  type: typeof FILTER_PRODUCTS;
  payload: FilterProductsPayload;
};

export type FilterResetAction = {
  type: typeof FILTER_RESET;
};

export type FilterProductsActions = FilterProductsAction | FilterResetAction;
