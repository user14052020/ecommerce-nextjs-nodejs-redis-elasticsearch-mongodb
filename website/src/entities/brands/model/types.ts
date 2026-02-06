import type { GenericRecord } from "@root/shared/types/common";

export const BRANDS_FETCH = "BRANDS_FETCH" as const;

export type BrandsState = {
  brands: GenericRecord[];
};

export type BrandsFetchAction = {
  type: typeof BRANDS_FETCH;
  payload: GenericRecord[];
};

export type BrandsActions = BrandsFetchAction;

export type BrandItem = {
  _id: string;
  title: string;
  image: string;
};
