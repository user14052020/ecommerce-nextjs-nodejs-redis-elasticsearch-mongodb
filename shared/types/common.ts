export type GenericRecord = Record<string, unknown>;

export type LanguageInfo = {
  languageId: string;
  locale: string;
  name: string;
  icon: string;
};

export type SettingsState = {
  locale: LanguageInfo;
  collapsed: boolean;
  settings: GenericRecord;
  errorFetch?: string;
};

export type BaseLoginUser = {
  id?: string;
  name?: string;
  username?: string;
  role: Record<string, boolean>;
  [key: string]: unknown;
};
