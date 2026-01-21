import enLang from "@app/providerLang/entries/en-US";
import rULang from "@app/providerLang/entries/ru-RU";
import tRLang from "@app/providerLang/entries/tr-TR";
import type { Locale } from "antd/es/locale";

export type LocaleEntry = {
  messages: Record<string, string>;
  antd: Locale;
  locale: string;
};

const AppLocale: Record<string, LocaleEntry> = {
  en: enLang,
  ru: rULang,
  tr: tRLang,
};

export default AppLocale;
