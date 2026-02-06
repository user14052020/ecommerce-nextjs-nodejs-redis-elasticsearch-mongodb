import { useEffect } from "react";
import { checkCookies } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";

import AuthService from "@app/entities/user/api/authService";
import { login_r, isAuthenticated_r } from "@app/entities/user/model/actions";
import { getBasket_r } from "@app/entities/basket/model/actions";
import type { LoginState } from "@app/entities/user/model/types";

export const useAuthBootstrap = () => {
   const dispatch = useDispatch();
   const { isAuthenticated } = useSelector(
      (state: { login: LoginState }) => state.login
   );

   useEffect(() => {
      if (!checkCookies("isuser")) {
         return;
      }
      if (isAuthenticated) {
         return;
      }

      AuthService.isAuthenticated().then((auth) => {
         if (auth.isAuthenticated) {
            dispatch(getBasket_r(auth.user.id || null));
            dispatch(login_r(auth.user));
            dispatch(isAuthenticated_r(true));
         }
      });
   }, [dispatch, isAuthenticated]);
};
