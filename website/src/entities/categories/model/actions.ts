import { GET_ALL_FETCH_FAIL } from "@root/shared/types/fetchError";
import axios from "axios";
import { API_URL } from "@root/config";
import type { GetAllFetchFailAction } from "@root/shared/types/fetchError";
import type { GenericRecord } from "@root/shared/types/common";
import type { CategoriesFetchAction } from "@app/entities/categories/model/types";
import type { Dispatch } from "redux";
import { CATEGORIES_FETCH } from "@app/entities/categories/model/types";

const buildFetchErrorMessage = (error: unknown) => {
   const message = error instanceof Error ? error.message : "Unknown error";
   if (axios.isAxiosError(error) && error.config?.url) {
      return `${message}: ${error.config.url.replace(API_URL, "api")}`;
   }
   return message;
};

export const getCategories_r =
   () =>
      async (
         dispatch: Dispatch<CategoriesFetchAction | GetAllFetchFailAction>
      ) => {
      try {
         const res = await axios.get<GenericRecord[]>(
            `${API_URL}/categoriespublic/true`
         );
         const action: CategoriesFetchAction = {
            type: CATEGORIES_FETCH,
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
