import { FILTER_PRODUCTS, FILTER_RESET } from "@app/redux/types";
import type { FilterProductsActions, FilterProductsState } from "@app/redux/types";

const initialSettings: FilterProductsState = {
   filterProducts: {
      brands: [],
      categories: [],
      text: "",
      variants: [],
      minPrice: null,
      maxPrice: null,
      sort: "",
      limit: 0,
      skip: 0,
   },
};

const brands = (
   state: FilterProductsState = initialSettings,
   action: FilterProductsActions
) => {
   switch (action.type) {
   case FILTER_PRODUCTS:
      return {
         ...state,
         filterProducts: action.payload,
      };
   case FILTER_RESET:
      return {
         ...state,
         filterProducts: {
            brands: [],
            categories: [],
            text: "",
            variants: [],
            minPrice: null,
            maxPrice: null,
            sort: "",
            limit: 0,
            skip: 0,
         },
      };

   default:
      return state;
   }
};

export default brands;
