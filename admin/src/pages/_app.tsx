import React from "react";
import Head from "next/head";
import withRedux from "next-redux-wrapper";
import type { AppProps } from "next/app";
import type { Store } from "redux";

import "antd/dist/antd.css";
import "@root/admin/public/loader.css";
import "@root/admin/public/global.scss";

import initStore from "@app/app/store/store";
import { Provider } from "react-redux";
import LocaleProvider from "@app/app/providers/LocaleProvider";
import AppLayout from "@app/widgets/Layout";

type AppWithStoreProps = AppProps & { store: Store };

const Page = ({ Component, pageProps, store }: AppWithStoreProps) => {
  return (
    <React.Fragment>
      <Head>
        <title> Admin Dashboard</title>
      </Head>
      <Provider store={store}>
        <LocaleProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </LocaleProvider>
      </Provider>
    </React.Fragment>
  );
};

export default withRedux(initStore)(Page);
