import func from "@root/shared/lib/helpers/func";
import { FOOTER_MENU_ID, TOPMENU_SOCIAL_ID } from "@root/config";
import type { TopMenuItem } from "@app/entities/topmenu/model/types";

type MenuItem = TopMenuItem;

export const buildMenuTrees = (topmenu: MenuItem[]) => {
   const topmenuTree =
      (func.getCategoriesTree(topmenu) as MenuItem[] | undefined) || [];
   const socialmediaTree =
      (func.getCategoriesTree(
         topmenu,
         TOPMENU_SOCIAL_ID
      ) as MenuItem[] | undefined) || [];
   const footerMenuTree =
      (func.getCategoriesTree(
         topmenu,
         FOOTER_MENU_ID
      ) as MenuItem[] | undefined) || [];

   return {
      topmenuTree,
      socialmediaTree,
      footerMenuTree,
   };
};
