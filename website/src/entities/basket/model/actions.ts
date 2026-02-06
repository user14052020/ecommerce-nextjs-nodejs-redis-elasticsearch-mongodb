import { BASKET_FETCH } from "@app/entities/basket/model/types";
import axios from "axios";
import { API_URL } from "@root/config";
import type { BasketFetchAction, BasketState } from "@app/entities/basket/model/types";
import type { Dispatch } from "redux";

export const updateBasket_r = (
   data: BasketState["basket"]
): BasketFetchAction => {
   return { type: BASKET_FETCH, payload: data };
};

export const getBasket_r =
   (id: string | null) => async (dispatch: Dispatch<BasketFetchAction>) => {
   if (id) {
      const res = await axios.get<BasketState["basket"]>(
         `${API_URL}/basket/customer/${id}`
      );
      const action: BasketFetchAction = {
         type: BASKET_FETCH,
         payload: res.data,
      };
      dispatch(action);
   }
   };
