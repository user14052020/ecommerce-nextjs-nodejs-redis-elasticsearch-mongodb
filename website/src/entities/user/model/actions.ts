import {
   SET_LOGIN,
   SET_ISAUTHENTICATED,
   SET_LOGOUT,
} from "@app/entities/user/model/types";
import type {
   LoginUser,
   SetIsAuthenticatedAction,
   SetLoginAction,
   SetLogoutAction,
} from "@app/entities/user/model/types";

export const login_r = (data: LoginUser): SetLoginAction => {
   return { type: SET_LOGIN, payload: data };
};

export const logout_r = (): SetLogoutAction => {
   return { type: SET_LOGOUT };
};

export function isAuthenticated_r(
   isAuthenticated: boolean
): SetIsAuthenticatedAction {
   return { type: SET_ISAUTHENTICATED, payload: isAuthenticated };
}
