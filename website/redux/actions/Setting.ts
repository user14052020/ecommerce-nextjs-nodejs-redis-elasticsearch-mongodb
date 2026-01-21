import {
   SWITCH_LANGUAGE,
   CHANGE_COLLAPSED,
   GET_SETTINGS,
   GET_ALL_FETCH_FAIL,
} from "@app/redux/types";
import axios from "axios";
import { API_URL } from "@root/config";
import type {
   ChangeCollapsedAction,
   GenericRecord,
   GetAllFetchFailAction,
   GetSettingsAction,
   LanguageInfo,
   SwitchLanguageAction,
} from "@app/redux/types";
import type { AppThunk } from "@app/redux/store";

const buildFetchErrorMessage = (error: unknown) => {
   const message = error instanceof Error ? error.message : "Unknown error";
   if (axios.isAxiosError(error) && error.config?.url) {
      return `${message}: ${error.config.url.replace(API_URL, "api")}`;
   }
   return message;
};

export function switchLanguage(locale: LanguageInfo): SwitchLanguageAction {
   return { type: SWITCH_LANGUAGE, payload: locale };
}

export function changeCollapsed_r(collapsed: boolean): ChangeCollapsedAction {
   return { type: CHANGE_COLLAPSED, payload: collapsed };
}

export const settings_r = (): AppThunk => async (dispatch) => {
   try {
      const res = await axios.get<GenericRecord>(`${API_URL}/settingspublic`);
      const action: GetSettingsAction = {
         type: GET_SETTINGS,
         payload: res.data,
      };
      dispatch(action);
   } catch (error) {
      const action: GetAllFetchFailAction = {
         type: GET_ALL_FETCH_FAIL,
         payload: buildFetchErrorMessage(error),
      };
      dispatch(action);
   }
};
