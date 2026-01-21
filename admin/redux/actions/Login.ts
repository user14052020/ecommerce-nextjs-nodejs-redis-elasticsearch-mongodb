import { SET_LOGIN, SET_ISAUTHENTICATED, SET_LOGOUT } from "@app/redux/types";
import type {
  LoginUser,
  SetLoginAction,
  SetIsAuthenticatedAction,
  SetLogoutAction,
} from "@app/redux/types";

export const login_r = (data: LoginUser): SetLoginAction => {
  return {
    type: SET_LOGIN,
    payload: data,
  };
};

export const logout_r = (): SetLogoutAction => {
  return {
    type: SET_LOGOUT,
  };
};

export function isAuthenticated_r(
  isAuthenticated: boolean
): SetIsAuthenticatedAction {
  return {
    type: SET_ISAUTHENTICATED,
    payload: isAuthenticated,
  };
}
