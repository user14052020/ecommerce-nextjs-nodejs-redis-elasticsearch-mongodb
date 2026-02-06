import type {
   FilterProductsAction,
   FilterProductsPayload,
   FilterResetAction,
} from "@app/features/filter-products/model/types";
import {
   FILTER_PRODUCTS,
   FILTER_RESET,
} from "@app/features/filter-products/model/types";

export const filterProducts_r = (
   data: FilterProductsPayload
): FilterProductsAction => {
   return { type: FILTER_PRODUCTS, payload: data };
};

export const filterReset_r = (): FilterResetAction => {
   return { type: FILTER_RESET };
};
