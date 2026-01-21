import type { FC } from "react";
import { FormattedMessage } from "react-intl";

type IntlMessageProps = {
   id: string;
   values?: Record<string, unknown>;
   [key: string]: unknown;
};

const IntlMessages: FC<IntlMessageProps> = (props) => {
   return <FormattedMessage {...props} />;
};

export default IntlMessages;
