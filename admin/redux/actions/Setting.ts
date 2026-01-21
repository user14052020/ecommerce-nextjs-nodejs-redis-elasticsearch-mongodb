import {
  SWITCH_LANGUAGE,
  CHANGE_COLLAPSED,
  GET_SETTINGS,
  GET_ALL_FETCH_FAIL,
} from "@app/redux/types";
import type {
  LanguageInfo,
  SwitchLanguageAction,
  ChangeCollapsedAction,
  GetSettingsAction,
  GetAllFetchFailAction,
} from "@app/redux/types";
import { API_URL } from "@root/config";
import axios from "axios";
import type { AppThunk } from "@app/redux/store";

export function switchLanguage(locale: LanguageInfo): SwitchLanguageAction {
  return {
    type: SWITCH_LANGUAGE,
    payload: locale,
  };
}

export function changeCollapsed_r(collapsed: boolean): ChangeCollapsedAction {
  return {
    type: CHANGE_COLLAPSED,
    payload: collapsed,
  };
}

export const settings_r = (): AppThunk => async (dispatch) => {
  await axios
    .get(`${API_URL}/settingspublic`)
    .then((res) => {
      const action: GetSettingsAction = {
        type: GET_SETTINGS,
        payload: res.data,
      };
      dispatch(action);
    })
    .catch((err) => {
      const action: GetAllFetchFailAction = {
        type: GET_ALL_FETCH_FAIL,
        payload: err.message + ": " + err.config.url.replace(API_URL, "api"),
      };
      dispatch(action);
    });
};
