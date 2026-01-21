import {
  CHANGE_COLLAPSED,
  SWITCH_LANGUAGE,
  GET_SETTINGS,
  GET_ALL_FETCH_FAIL,
} from "@app/redux/types";
import type { SettingsActions, SettingsState } from "@app/redux/types";
import { defaultLanguage } from "@root/config";

const initialSettings: SettingsState = {
  locale: defaultLanguage,
  collapsed: false,
  settings: {},
  errorFetch: "",
};

const settings = (
  state: SettingsState = initialSettings,
  action: SettingsActions
): SettingsState => {
  switch (action.type) {
    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload,
      };
    case CHANGE_COLLAPSED:
      return {
        ...state,
        collapsed: action.payload,
      };
    case GET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case GET_ALL_FETCH_FAIL:
      return {
        ...state,
        errorFetch: action.payload,
      };
    default:
      return state;
  }
};

export default settings;
