import { Layout } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { SettingsState } from "@root/shared/types/common";
import type { TopmenuState } from "@app/entities/topmenu/model/types";
import { useAuthBootstrap } from "@app/entities/user/model/useAuthBootstrap";
import { useSettingsErrorToast } from "@app/entities/settings/model/useSettingsErrorToast";
import { buildMenuTrees } from "@app/entities/topmenu/lib/buildMenuTrees";

const CategoriesMenu = dynamic(() => import("@app/entities/categories/ui/CategoriesMenu"));
const TopMenu = dynamic(() => import("@app/entities/topmenu/ui/TopMenu"));
const Footer = dynamic(() => import("@app/widgets/Footer"));
const Header = dynamic(() => import("@app/widgets/Header"));

axios.defaults.withCredentials = true;

const { Content } = Layout;

type AppLayoutProps = {
   children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
   const router = useRouter();
   const { errorFetch } = useSelector(
      (state: { settings: SettingsState }) => state.settings
   );
   const { topmenu } = useSelector(
      (state: { topmenu: TopmenuState }) => state.topmenu
   );

   useAuthBootstrap();
   useSettingsErrorToast(errorFetch);

   const isUnRestrictedRoute = (pathname: string) => {
      return pathname === "/sitemap.xml";
   };

   const { topmenuTree, socialmediaTree, footerMenuTree } =
      buildMenuTrees(topmenu as typeof topmenu);

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
