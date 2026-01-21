import type { ComponentProps } from "react";
import { FormattedMessage } from "react-intl";

type IntlMessageProps = Omit<ComponentProps<typeof FormattedMessage>, "children">;

const IntlMessages = (props: IntlMessageProps) => {
   return <FormattedMessage {...props} />;
};

export default IntlMessages;
