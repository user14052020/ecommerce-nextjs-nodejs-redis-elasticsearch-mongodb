import { GET_ALL_FETCH_FAIL } from "@root/shared/types/fetchError";
import axios from "axios";
import { API_URL } from "@root/config";
import type { GetAllFetchFailAction } from "@root/shared/types/fetchError";
import type { GenericRecord } from "@root/shared/types/common";
import type { BrandsFetchAction } from "@app/entities/brands/model/types";
import type { Dispatch } from "redux";
import { BRANDS_FETCH } from "@app/entities/brands/model/types";

const buildFetchErrorMessage = (error: unknown) => {
   const message = error instanceof Error ? error.message : "Unknown error";
   if (axios.isAxiosError(error) && error.config?.url) {
      return `${message}: ${error.config.url.replace(API_URL, "api")}`;
   }
   return message;
};

export const getBrands_r =
   () => async (dispatch: Dispatch<BrandsFetchAction | GetAllFetchFailAction>) => {
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
