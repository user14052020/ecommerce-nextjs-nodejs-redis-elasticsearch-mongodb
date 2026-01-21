import type { AppProps } from "next/app";
import { wrapper } from "@app/redux/store";
import type { AppDispatch } from "@app/redux/store";

import "@app/public/global.scss";


import LocaleProvider from "@app/app/core/LocaleProvider";
import AppLayout from "@app/app/core/Layout";
import {
   getBrands_r,
   getCategories_r,
   getTopmenu_r,
   settings_r,
} from "@app/redux/actions";



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
