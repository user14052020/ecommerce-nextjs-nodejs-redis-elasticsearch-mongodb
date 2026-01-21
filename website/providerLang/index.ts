import enLang from "@app/providerLang/entries/en-US";
import rULang from "@app/providerLang/entries/ru-RU";
import tRLang from "@app/providerLang/entries/tr-TR";

export type LocaleEntry = {
  messages: Record<string, string>;
  antd: any;
  locale: string;
};

const AppLocale: Record<string, LocaleEntry> = {
  en: enLang,
  ru: rULang,
  tr: tRLang,
};

export default AppLocale;
