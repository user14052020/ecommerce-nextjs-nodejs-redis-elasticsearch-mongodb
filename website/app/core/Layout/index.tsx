import { useEffect } from "react";
import { Layout, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
   login_r,
   isAuthenticated_r,
   getBasket_r,
} from "@app/redux/actions";
import { useRouter } from "next/router";
import AuthService from "@app/util/services/authservice";
import axios from "axios";
import func from "@app/util/helpers/func";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { FOOTER_MENU_ID, TOPMENU_SOCIAL_ID } from "@root/config";
import type { AppDispatch, RootState } from "@app/redux/store";

const CategoriesMenu = dynamic(() => import("@app/app/components/CategoriesMenu"));
const TopMenu = dynamic(() => import("@app/app/components/TopMenu"));
const Footer = dynamic(() => import("@app/app/components/Footer"));
const Header = dynamic(() => import("@app/app/components/Header"));

import { checkCookies } from "cookies-next";
const haveCookie = checkCookies("isuser");



axios.defaults.withCredentials = true;

const { Content } = Layout;

type AppLayoutProps = {
   children: ReactNode;
};

type MenuItem = {
   title: string;
   link?: string;
   seo?: string;
   isActive?: boolean;
   children?: MenuItem[];
};

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {

   const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();
   const { errorFetch } = useSelector((state: RootState) => state.settings);
   const { isAuthenticated } = useSelector((state: RootState) => state.login);
   const { topmenu } = useSelector((state: RootState) => state.topmenu);

   const loginControl = () => {
      if (!isAuthenticated) {
         AuthService.isAuthenticated().then((auth) => {
            if (auth.isAuthenticated) {
               dispatch(getBasket_r(auth.user.id || null));
               dispatch(login_r(auth.user));
               dispatch(isAuthenticated_r(true));
            }
         });
      }
   };

   const fetchError = () => {
      if (errorFetch) {
         message.error(errorFetch);
      }
   };



   useEffect(() => {
      if (haveCookie) {
         loginControl();
      }
      fetchError();
   }, [isAuthenticated]);

   const isUnRestrictedRoute = (pathname: string) => {
      return pathname === "/sitemap.xml";
   };

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

   return isUnRestrictedRoute(router.pathname) ? (
      <>{children}</>
   ) : (
      <>
         {/* <CircularProgress className={!isLoaded ? "visible" : "hidden"} /> */}
         <Layout>
            <div className="border-b bg-white">
               <div className=" container-custom   ">
                  <div className="h-7">
                     <TopMenu
                        socialmedia={socialmediaTree}
                        topmenu={topmenuTree}
                     />
                  </div>
                  <Header />
                  <div className="h-11">
                     <CategoriesMenu />
                  </div>
               </div>
            </div>
            <div className="  min-h-screen ">
               <Content >{children}</Content>
            </div>
            <Footer
               footerMenu={footerMenuTree}
            />
         </Layout>
      </>
   );
};

export default AppLayout;
