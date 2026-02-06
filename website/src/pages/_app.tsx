import type { AppProps } from "next/app";
import { wrapper } from "@app/app/store/store";
import type { AppDispatch } from "@app/app/store/store";

import "@root/website/public/global.scss";

import LocaleProvider from "@app/app/providers/LocaleProvider";
import AppLayout from "@app/widgets/Layout";
import { settings_r } from "@app/entities/settings/model/actions";
import { getBrands_r } from "@app/entities/brands/model/actions";
import { getCategories_r } from "@app/entities/categories/model/actions";
import { getTopmenu_r } from "@app/entities/topmenu/model/actions";

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

HomeApp.getInitialProps = wrapper.getInitialPageProps((store) => async () => {
  const dispatch = store.dispatch as AppDispatch;
  await dispatch(getBrands_r());
  await dispatch(settings_r());
  await dispatch(getCategories_r());
  await dispatch(getTopmenu_r());
});

export default wrapper.withRedux(HomeApp);
