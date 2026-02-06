import { CATEGORIES_FETCH } from "@app/entities/categories/model/types";
import type {
   CategoriesActions,
   CategoriesState,
} from "@app/entities/categories/model/types";

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
