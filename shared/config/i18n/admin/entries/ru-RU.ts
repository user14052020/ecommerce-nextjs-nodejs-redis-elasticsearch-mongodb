import antdRu from "antd/lib/locale-provider/ru_RU";
import ruMessages from "../locales/ru_RU.json";
import type { LocaleEntry } from "../../types";

const RuLang: LocaleEntry = {
  messages: {
    ...ruMessages,
  },
  antd: antdRu,
  locale: "ru-RU",
};

export default RuLang;
