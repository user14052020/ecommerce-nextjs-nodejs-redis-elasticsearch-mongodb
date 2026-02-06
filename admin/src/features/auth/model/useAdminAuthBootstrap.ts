import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import AuthService from "@app/shared/api/authservice";
import { login_r, isAuthenticated_r } from "@app/features/auth/model/actions";
import type { AppDispatch, RootState } from "@app/app/store/store";

export const useAdminAuthBootstrap = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    AuthService.isAuthenticated().then(async (auth) => {
      if (auth.isAuthenticated) {
        await dispatch(login_r(auth.user));
        await dispatch(isAuthenticated_r(true));
        return;
      }

      if (router.pathname == "/signup") {
        router.push("/signup");
      } else if (router.pathname == "/forgotpassword") {
        router.push("/forgotpassword");
      } else if (router.pathname == "/resetpassword") {
        router.push({
          pathname: "/resetpassword",
          query: router.query,
        });
      } else {
        router.push("/signin");
      }
    });
  }, [dispatch, isAuthenticated, router]);
};
