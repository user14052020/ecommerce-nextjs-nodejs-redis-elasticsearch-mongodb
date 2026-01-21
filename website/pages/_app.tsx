import type { AppProps } from "next/app";
import { wrapper } from "@app/redux/store";

import "@app/public/global.scss";

import LocaleProvider from "@app/app/core/LocaleProvider";
import AppLayout from "@app/app/core/Layout";

const HomeApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <LocaleProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </LocaleProvider>
    </>
  );
};

export default wrapper.withRedux(HomeApp);
