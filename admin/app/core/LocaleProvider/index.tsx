import React from "react";
import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import AppLocale from "@app/app/core/providerLang";
import type { ReactNode } from "react";
import type { RootState } from "@app/redux/reducers";

type LocaleProviderProps = {
  children: ReactNode;
};

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const { locale } = useSelector((state: RootState) => state.settings);
  const currentAppLocale = AppLocale[locale.locale as "en" | "tr" | "ru"];

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
