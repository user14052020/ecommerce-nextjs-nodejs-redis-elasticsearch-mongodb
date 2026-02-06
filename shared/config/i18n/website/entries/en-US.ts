import antdEn from "antd/lib/locale-provider/en_US";
import enMessages from "../locales/en_US.json";
import type { LocaleEntry } from "../../types";

const EnLang: LocaleEntry = {
  messages: {
    ...enMessages,
  },
  antd: antdEn,
  locale: "en-US",
};
export default EnLang;
