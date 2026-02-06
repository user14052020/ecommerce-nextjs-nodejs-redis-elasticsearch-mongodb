import { GET_ALL_FETCH_FAIL } from "@root/shared/types/fetchError";
import axios from "axios";
import { API_URL } from "@root/config";
import type { GetAllFetchFailAction } from "@root/shared/types/fetchError";
import type {
   TopMenuItem,
   TopmenuFetchAction,
} from "@app/entities/topmenu/model/types";
import type { Dispatch } from "redux";
import { TOPMENU_FETCH } from "@app/entities/topmenu/model/types";

const buildFetchErrorMessage = (error: unknown) => {
   const message = error instanceof Error ? error.message : "Unknown error";
   if (axios.isAxiosError(error) && error.config?.url) {
      return `${message}: ${error.config.url.replace(API_URL, "api")}`;
   }
   return message;
};

export const getTopmenu_r =
   () => async (dispatch: Dispatch<TopmenuFetchAction | GetAllFetchFailAction>) => {
   try {
      const res = await axios.get<TopMenuItem[]>(
         `${API_URL}/topmenupublic/not`
      );
      const action: TopmenuFetchAction = {
         type: TOPMENU_FETCH,
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
