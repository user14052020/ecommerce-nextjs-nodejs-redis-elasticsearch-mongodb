import { CATEGORIES_FETCH } from "@app/redux/types";
import type { CategoriesActions, CategoriesState } from "@app/redux/types";

const initialSettings: CategoriesState = {
   categories: [],
};

const categories = (
   state: CategoriesState = initialSettings,
   action: CategoriesActions
) => {
   switch (action.type) {
   case CATEGORIES_FETCH:
      return {
         ...state,
         categories: action.payload,
      };

   default:
      return state;
   }
};

export default categories;
