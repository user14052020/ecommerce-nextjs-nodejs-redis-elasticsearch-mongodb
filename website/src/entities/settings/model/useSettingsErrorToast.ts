import { useEffect } from "react";
import { message } from "antd";

export const useSettingsErrorToast = (errorFetch?: string) => {
   useEffect(() => {
      if (errorFetch) {
         message.error(errorFetch);
      }
   }, [errorFetch]);
};
