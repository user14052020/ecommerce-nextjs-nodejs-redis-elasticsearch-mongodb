import type { BaseLoginUser, GenericRecord } from "@root/shared/types/common";

export const SET_LOGIN = "SET_LOGIN" as const;
export const SET_ISAUTHENTICATED = "SET_ISAUTHENTICATED" as const;
export const SET_LOGOUT = "SET_LOGOUT" as const;

export type LoginUser = BaseLoginUser & {
  address?: GenericRecord[];
};

export type LoginState = {
  user: LoginUser;
  isAuthenticated: boolean;
};

export type SetLoginAction = {
  type: typeof SET_LOGIN;
  payload: LoginUser;
};

export type SetIsAuthenticatedAction = {
  type: typeof SET_ISAUTHENTICATED;
  payload: boolean;
};

export type SetLogoutAction = {
  type: typeof SET_LOGOUT;
};

export type LoginActions =
  | SetLoginAction
  | SetIsAuthenticatedAction
  | SetLogoutAction;
