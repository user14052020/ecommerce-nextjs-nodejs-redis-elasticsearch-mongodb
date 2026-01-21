import Router from "next/router";
import type { NextPageContext } from "next";

const redirect = (context: NextPageContext | null, target: string) => {
   if (context?.res) {
      context.res.writeHead(303, { Location: target });
      context.res.end();
   } else {
      Router.replace(target);
   }
};

export default redirect;
