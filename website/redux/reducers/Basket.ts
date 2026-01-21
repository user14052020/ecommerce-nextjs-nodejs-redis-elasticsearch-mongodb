import { BASKET_FETCH } from "@app/redux/types";
import type { BasketActions, BasketState } from "@app/redux/types";

const initialSettings: BasketState = {
   basket: [
      {
         created_user: {
            name: "",
            id: "",
         },
         customer_id: "",
         products: [],
      },
   ],
};

const basket = (
   state: BasketState = initialSettings,
   action: BasketActions
) => {
   switch (action.type) {
   case BASKET_FETCH:
      return {
         ...state,
         basket: action.payload,
      };

   default:
      return state;
   }
};

export default basket;
