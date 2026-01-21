import antdTr from "antd/lib/locale-provider/tr_TR";
import trMessages from "@app/providerLang/locales/tr_TR.json";
import type { LocaleEntry } from "@app/providerLang/index";

const TrLang: LocaleEntry = {
  messages: {
    ...trMessages,
  },
  antd: antdTr,
  locale: "tr-TR",
};
export default TrLang;
