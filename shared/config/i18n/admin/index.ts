import enLang from "./entries/en-US";
import rULang from "./entries/ru-RU";
import tRLang from "./entries/tr-TR";
import type { LocaleEntry } from "../types";

const AppLocale: Record<string, LocaleEntry> = {
  en: enLang,
  ru: rULang,
  tr: tRLang,
};

export default AppLocale;
