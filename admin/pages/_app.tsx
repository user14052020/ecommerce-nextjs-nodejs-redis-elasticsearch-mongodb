import React from "react";
import Head from "next/head";
import withRedux from "next-redux-wrapper";
import type { AppProps } from "next/app";
import type { Store } from "redux";

import "antd/dist/antd.css";
import "@app/public/loader.css";
import "@app/public/global.scss";

import initStore from "@app/redux/store";
import { Provider } from "react-redux";
import LocaleProvider from "@app/app/core/LocaleProvider";
import AppLayout from "@app/app/core/Layout";

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
