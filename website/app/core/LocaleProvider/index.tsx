import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import AppLocale from "@app/providerLang";
import type { ReactNode } from "react";
import type { RootState } from "@app/redux/store";

type LocaleProviderProps = {
   children: ReactNode;
};

const LocaleProvider = ({ children }: LocaleProviderProps) => {
   const { locale } = useSelector((state: RootState) => state.settings);
   const currentAppLocale = AppLocale[locale.locale] || AppLocale.en;

   return (
      <ConfigProvider locale={currentAppLocale.antd}>
         <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
         >
            {children}
         </IntlProvider>
      </ConfigProvider>
   );
};

export default LocaleProvider;
