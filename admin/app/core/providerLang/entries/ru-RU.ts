import antdRu from "antd/lib/locale-provider/ru_RU";
import ruMessages from "@app/app/core/providerLang/locales/ru_RU.json";

const RuLang = {
  messages: {
    ...ruMessages,
  },
  antd: antdRu,
  locale: "ru-RU",
};

export default RuLang;
