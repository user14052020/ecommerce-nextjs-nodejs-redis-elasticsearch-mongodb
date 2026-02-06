import {
  SWITCH_LANGUAGE,
  CHANGE_COLLAPSED,
  GET_SETTINGS,
  GET_ALL_FETCH_FAIL,
} from "@app/app/store/types";
import type {
  LanguageInfo,
  SwitchLanguageAction,
  ChangeCollapsedAction,
  GetSettingsAction,
  GetAllFetchFailAction,
} from "@app/app/store/types";
import { API_URL } from "@root/config";
import axios from "axios";
import { buildFetchErrorMessage } from "@root/shared/lib/http/buildFetchErrorMessage";
import type { AppThunk } from "@app/app/store/store";

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
  try {
    const res = await axios.get(`${API_URL}/settingspublic`);
    const action: GetSettingsAction = {
      type: GET_SETTINGS,
      payload: res.data,
    };
    dispatch(action);
  } catch (error) {
    const action: GetAllFetchFailAction = {
      type: GET_ALL_FETCH_FAIL,
      payload: buildFetchErrorMessage(error, API_URL),
    };
    dispatch(action);
  }
};
