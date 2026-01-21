import antdRu from "antd/lib/locale-provider/ru_RU";
import ruMessages from "@app/providerLang/locales/ru_RU.json";
import type { LocaleEntry } from "@app/providerLang/index";

const RuLang: LocaleEntry = {
  messages: {
    ...ruMessages,
  },
  antd: antdRu,
  locale: "ru-RU",
};

export default RuLang;
