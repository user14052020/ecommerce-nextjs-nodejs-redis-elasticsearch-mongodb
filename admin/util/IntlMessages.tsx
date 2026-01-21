import React from "react";
import { FormattedMessage } from "react-intl";
import type { MessageDescriptor } from "react-intl";

const InjectMessage = (props: MessageDescriptor) => (
  <FormattedMessage {...props} />
);

export default InjectMessage;
