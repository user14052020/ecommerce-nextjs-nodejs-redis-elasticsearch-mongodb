import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import AppLocale from "@root/shared/config/i18n/website";
import type { ReactNode } from "react";
import type { SettingsState } from "@root/shared/types/common";

type LocaleProviderProps = {
   children: ReactNode;
};

const LocaleProvider = ({ children }: LocaleProviderProps) => {
   const { locale } = useSelector(
      (state: { settings: SettingsState }) => state.settings
   );
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
