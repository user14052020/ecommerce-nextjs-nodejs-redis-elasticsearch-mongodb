import type {
  GenericRecord,
  LanguageInfo,
  SettingsState,
} from "@root/shared/types/common";
import type { GetAllFetchFailAction } from "@root/shared/types/fetchError";
import { GET_ALL_FETCH_FAIL } from "@root/shared/types/fetchError";

export const SWITCH_LANGUAGE = "SWITCH-LANGUAGE" as const;
export const CHANGE_COLLAPSED = "CHANGE_COLLAPSED" as const;
export const GET_SETTINGS = "GET_SETTINGS" as const;

export type SwitchLanguageAction = {
  type: typeof SWITCH_LANGUAGE;
  payload: LanguageInfo;
};

export type ChangeCollapsedAction = {
  type: typeof CHANGE_COLLAPSED;
  payload: boolean;
};

export type GetSettingsAction = {
  type: typeof GET_SETTINGS;
  payload: GenericRecord;
};


export type SettingsActions =
  | SwitchLanguageAction
  | ChangeCollapsedAction
  | GetSettingsAction
  | GetAllFetchFailAction;

export type { GenericRecord, LanguageInfo, SettingsState, GetAllFetchFailAction };
export { GET_ALL_FETCH_FAIL };
