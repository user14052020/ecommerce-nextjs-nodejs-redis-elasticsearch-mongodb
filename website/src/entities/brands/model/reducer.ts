import { BRANDS_FETCH } from "@app/entities/brands/model/types";
import type { BrandsActions, BrandsState } from "@app/entities/brands/model/types";

const initialSettings: BrandsState = {
   brands: [],
};

const brands = (
   state: BrandsState = initialSettings,
   action: BrandsActions
) => {
   switch (action.type) {
   case BRANDS_FETCH:
      return {
         ...state,
         brands: action.payload,
      };

   default:
      return state;
   }
};

export default brands;
