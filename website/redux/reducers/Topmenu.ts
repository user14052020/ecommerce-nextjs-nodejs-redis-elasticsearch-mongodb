import { TOPMENU_FETCH } from "@app/redux/types";
import type { TopmenuActions, TopmenuState } from "@app/redux/types";

const initialSettings: TopmenuState = {
   topmenu: [],
};

const topmenu = (
   state: TopmenuState = initialSettings,
   action: TopmenuActions
) => {
   switch (action.type) {
   case TOPMENU_FETCH:
      return {
         ...state,
         topmenu: action.payload,
      };

   default:
      return state;
   }
};

export default topmenu;
