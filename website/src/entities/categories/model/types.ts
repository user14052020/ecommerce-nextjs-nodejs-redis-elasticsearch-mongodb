import type { GenericRecord } from "@root/shared/types/common";

export const CATEGORIES_FETCH = "CATEGORIES_FETCH" as const;

export type CategoriesState = {
  categories: GenericRecord[];
};

export type CategoriesFetchAction = {
  type: typeof CATEGORIES_FETCH;
  payload: GenericRecord[];
};

export type CategoriesActions = CategoriesFetchAction;

export type CategoryNode = {
  _id: string;
  title: string;
  children?: CategoryNode[];
  order?: number;
  parentId?: string | null;
};
