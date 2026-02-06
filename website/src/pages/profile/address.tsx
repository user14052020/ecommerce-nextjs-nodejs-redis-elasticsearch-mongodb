import { useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";
import type { LoginState } from "@app/entities/user/model/types";

import dynamic from "next/dynamic";

const Head = dynamic(() => import("@app/shared/ui/SeoHead"));
const Address = dynamic(() => import("@app/widgets/profile/Address"));
const ProfileLeftMenu = dynamic(() => import("@app/widgets/profile/LeftMenu"));


const Default = () => {
   const { isAuthenticated } = useSelector(
      (state: { login: LoginState }) => state.login
   );

   useEffect(() => {
      if (!isAuthenticated) {
         Router.push("/");
      }
   }, [isAuthenticated]);

   return (
      <>
         <Head title="Address" />
         <div className="container-custom ">
            <div className="grid shadow-lg p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
               <div className=" col-span-12 order-2 lg:order-1 lg:col-span-3 ">
                  <ProfileLeftMenu />
               </div>
               <div className=" col-span-12 order-1 lg:order-2 lg:col-span-9 ">
                  <div className="text-2xl font-semibold col-span-12 text-brand-color  mb-5">
              Addresses{" "}
                  </div>
                  <Address />
               </div>
            </div>
         </div>
      </>
   );
};

export default Default;
