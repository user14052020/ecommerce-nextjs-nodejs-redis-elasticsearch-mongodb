import React from "react";
import dynamic from "next/dynamic";

import { Layout } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { changeCollapsed_r } from "@app/features/settings/model/actions";

import { useRouter } from "next/router";

import CircularProgress from "@root/shared/ui/CircularProgress";
import axios from "axios";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "@app/app/store/store";
import { useAdminAuthBootstrap } from "@app/features/auth/model/useAdminAuthBootstrap";
import { useSettingsBootstrap } from "@app/features/settings/model/useSettingsBootstrap";

axios.defaults.withCredentials = true;

const { Content } = Layout;

const Sidebar = dynamic(() => import("@app/widgets/Layout/Sidebar"), {
  loading: () => <CircularProgress />,
});

const Topheader = dynamic(() => import("@app/widgets/Layout/Topheader"), {
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

  useSettingsBootstrap();
  useAdminAuthBootstrap();

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
