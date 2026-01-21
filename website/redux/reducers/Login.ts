import { SET_ISAUTHENTICATED, SET_LOGIN, SET_LOGOUT } from "@app/redux/types";
import type { LoginActions, LoginState } from "@app/redux/types";

const INIT_STATE: LoginState = {
   user: {
      name: "",
      address: [],
      role: {
         blabla: false,
      },
   },
   isAuthenticated: false,
};

const States = (state: LoginState = INIT_STATE, action: LoginActions) => {
   switch (action.type) {
   case SET_ISAUTHENTICATED: {
      return {
         ...state,
         isAuthenticated: action.payload,
      };
   }
   case SET_LOGIN: {
      return {
         ...state,
         user: action.payload,
      };
   }
   case SET_LOGOUT: {
      return {
         ...state,
         user: { role: { view: false } },
         isAuthenticated: false,
      };
   }
   default:
      return state;
   }
};
export default States;
