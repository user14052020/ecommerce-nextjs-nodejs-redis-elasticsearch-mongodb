import React, { useEffect } from "react";
import dynamic from "next/dynamic";

import { Layout } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { login_r, isAuthenticated_r } from "@app/redux/actions/Login";
import { changeCollapsed_r, settings_r } from "@app/redux/actions";

import { useRouter } from "next/router";

import CircularProgress from "@app/app/components/CircularProgress";
import AuthService from "@app/util/services/authservice";
import axios from "axios";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "@app/redux/store";

axios.defaults.withCredentials = true;

const { Content } = Layout;

const Sidebar = dynamic(() => import("@app/app/core/Layout/Sidebar"), {
  loading: () => <CircularProgress />,
});

const Topheader = dynamic(() => import("@app/app/core/Layout/Topheader"), {
  loading: () => <CircularProgress />,
});

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { collapsed } = useSelector((state: RootState) => state.settings);
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  const loginControl = async () => {
    dispatch(settings_r());
    if (!isAuthenticated) {
      AuthService.isAuthenticated().then(async (auth) => {
        if (auth.isAuthenticated) {
          await dispatch(login_r(auth.user));
          await dispatch(isAuthenticated_r(true));
        } else {
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
        }
      });
    }
  };

  useEffect(() => {
    loginControl();
  }, []);

  const isUnRestrictedRoute = (pathname: string) => {
    return (
      pathname === "/signin" ||
      pathname === "/signup" ||
      pathname === "/forgotpassword" ||
      pathname === "/resetpassword"
    );
  };

  return isUnRestrictedRoute(router.pathname) ? (
    <>{children}</>
  ) : (
    <>
      {isAuthenticated ? (
        <Layout>
          <Sidebar />

          <div
            className="mobileCollapse"
            style={{ display: !collapsed ? "block" : "none" }}
            onClick={() => dispatch(changeCollapsed_r(!collapsed))}
          />
          <Layout className="site-layout">
            <Topheader />
            <Content className="site-layout-background">{children}</Content>
          </Layout>
        </Layout>
      ) : (
        <div className="loader-view">
          <div className="loader">...............</div>
        </div>
      )}
    </>
  );
};

export default AppLayout;
