import type { GenericRecord } from "@root/shared/types/common";

export const TOPMENU_FETCH = "TOPMENU_FETCH" as const;

export type TopMenuItem = GenericRecord & {
  _id: string;
  title: string;
  link?: string;
  seo?: string;
  isActive?: boolean;
  children?: TopMenuItem[];
};

export type TopmenuState = {
  topmenu: TopMenuItem[];
};

export type TopmenuFetchAction = {
  type: typeof TOPMENU_FETCH;
  payload: TopMenuItem[];
};

export type TopmenuActions = TopmenuFetchAction;
