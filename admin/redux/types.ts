export const SWITCH_LANGUAGE = "SWITCH-LANGUAGE" as const;
export const SET_LOGIN = "SET_LOGIN" as const;
export const SET_ISAUTHENTICATED = "SET_ISAUTHENTICATED" as const;
export const SET_LOGOUT = "SET_LOGOUT" as const;

export const CHANGE_COLLAPSED = "CHANGE_COLLAPSED" as const;
export const GET_SETTINGS = "GET_SETTINGS" as const;
export const GET_ALL_FETCH_FAIL = "GET_ALL_FETCH_FAIL" as const;

export type GenericRecord = Record<string, unknown>;

export interface LanguageInfo {
  languageId: string;
  locale: string;
  name: string;
  icon: string;
}

export interface SettingsState {
  locale: LanguageInfo;
  collapsed: boolean;
  settings: GenericRecord;
  errorFetch?: string;
}

export interface LoginUser {
  id?: string;
  name?: string;
  username?: string;
  phone?: string;
  prefix?: string;
  role: Record<string, boolean>;
  [key: string]: unknown;
}

export interface LoginState {
  user: LoginUser;
  isAuthenticated: boolean;
}

export interface SwitchLanguageAction {
  type: typeof SWITCH_LANGUAGE;
  payload: LanguageInfo;
}

export interface ChangeCollapsedAction {
  type: typeof CHANGE_COLLAPSED;
  payload: boolean;
}

export interface GetSettingsAction {
  type: typeof GET_SETTINGS;
  payload: GenericRecord;
}

export interface GetAllFetchFailAction {
  type: typeof GET_ALL_FETCH_FAIL;
  payload: string;
}

export interface SetLoginAction {
  type: typeof SET_LOGIN;
  payload: LoginUser;
}

export interface SetIsAuthenticatedAction {
  type: typeof SET_ISAUTHENTICATED;
  payload: boolean;
}

export interface SetLogoutAction {
  type: typeof SET_LOGOUT;
}

export type SettingsActions =
  | SwitchLanguageAction
  | ChangeCollapsedAction
  | GetSettingsAction
  | GetAllFetchFailAction;

export type LoginActions =
  | SetLoginAction
  | SetIsAuthenticatedAction
  | SetLogoutAction;

export type AppActions = SettingsActions | LoginActions;
