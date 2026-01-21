import { BRANDS_FETCH, GET_ALL_FETCH_FAIL } from "@app/redux/types";
import axios from "axios";
import { API_URL } from "@root/config";
import type {
   BrandsFetchAction,
   GenericRecord,
   GetAllFetchFailAction,
} from "@app/redux/types";
import type { AppThunk } from "@app/redux/store";

const buildFetchErrorMessage = (error: unknown) => {
   const message = error instanceof Error ? error.message : "Unknown error";
   if (axios.isAxiosError(error) && error.config?.url) {
      return `${message}: ${error.config.url.replace(API_URL, "api")}`;
   }
   return message;
};

export const getBrands_r = (): AppThunk => async (dispatch) => {
   try {
      const res = await axios.get<GenericRecord[]>(`${API_URL}/brandspublic`);
      const action: BrandsFetchAction = {
         type: BRANDS_FETCH,
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
