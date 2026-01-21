declare module "@root/config" {
  export const API_URL: string;
  export const WEBSITE_URL: string;
  export const IMG_URL: string;
  export const maillerConfig: {
    service: string;
    auth: { user: string; pass: string };
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
  export const TOPMENU_SOCIAL_ID: string;
  export const FOOTER_MENU_ID: string;
  export const HOME_SLIDER_CATEGORY_ID: string;
  export const HOME_FIRST_BOX_CATEGORY_ID: string;
  export const HOME_OFFER_LIST_ID: string;
  export const PAYMENT_STRIPE_METHOD_ID: string;
}
