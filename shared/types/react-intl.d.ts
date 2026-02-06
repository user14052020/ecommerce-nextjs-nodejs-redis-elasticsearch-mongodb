import "react-intl";

declare module "react-intl" {
  interface IntlShape {
    messages: Record<string, string>;
  }
}
