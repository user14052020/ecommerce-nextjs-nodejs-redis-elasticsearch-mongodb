import antdEn from "antd/lib/locale-provider/en_US";
import enMessages from "@app/providerLang/locales/en_US.json";
import type { LocaleEntry } from "@app/providerLang/index";

const EnLang: LocaleEntry = {
  messages: {
    ...enMessages,
  },
  antd: antdEn,
  locale: "en-US",
};
export default EnLang;
