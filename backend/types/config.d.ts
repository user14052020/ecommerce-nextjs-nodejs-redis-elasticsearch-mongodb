declare module "@root/config" {
  export const API_URL: string;
  export const WEBSITE_URL: string;
  export const IMG_URL: string;
  export const maillerConfig: {
    service: string;
    auth: {
      user: string;
      pass: string;
    };
  };
  export const languageData: Array<{
    languageId: string;
    locale: string;
    name: string;
    icon: string;
  }>;
  export const defaultLanguage: {
    languageId: string;
    locale: string;
    name: string;
    icon: string;
  };
}
