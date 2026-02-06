import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LoginOutlined, LogoutOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import router from "next/router";
import { removeCookies, setCookies } from "cookies-next";

import AuthService from "@app/entities/user/api/authService";
import { login_r, isAuthenticated_r, logout_r } from "@app/entities/user/model/actions";
import LoginForm from "@app/features/auth/ui/LoginForm";
import RegisterForm from "@app/features/auth/ui/RegisterForm";
import type { LoginState } from "@app/entities/user/model/types";


type AuthPayload = {
   username: string;
   password: string;
   [key: string]: unknown;
};

type RegisterPayload = AuthPayload & {
   name?: string;
   surname?: string;
   phone?: string;
   prefix?: string;
};

const AuthControls = () => {
   const { isAuthenticated } = useSelector(
      (state: { login: LoginState }) => state.login
   );
   const [openModalLogin, setOpenModalLogin] = useState(false);
   const [confirmLoadingLogin, setConfirmLoadingLogin] = useState(false);
   const [openModalSignup, setOpenModalSignup] = useState(false);
   const [confirmLoadingSignup, setConfirmLoadingSignup] = useState(false);
   const [stateisAuthenticated, setStateisAuthenticated] = useState(false);

   const dispatch = useDispatch();

   const onSubmitSignup = (Data: RegisterPayload) => {
      Data["username"] = Data.username.toLowerCase();

      AuthService.register(Data)
         .then((res) => {
            const data = res as { error?: unknown; messagge?: string };
            if (data.error) {
               message.error(data.messagge || "Signup failed");
            } else {
               message.success(data.messagge || "Signup successful");
               onSubmitLogin(Data);
            }
         })
         .catch((err) => console.log("err", err));
   };

   const onSubmitLogin = (Data: AuthPayload) => {
      Data["username"] = Data.username.toLowerCase();
      AuthService.login(Data).then((data) => {
         const { isAuthenticated, user } = data;
         if (isAuthenticated) {
            dispatch(login_r(user));
            dispatch(isAuthenticated_r(true));
            message.success("Login Successfully");
            setOpenModalLogin(false);
            setOpenModalSignup(false);
            setCookies("isuser", true);
         } else {
            message.error("Login not Successfully");
         }
      });
   };

   useEffect(() => {
      if (isAuthenticated) {
         setStateisAuthenticated(isAuthenticated);
      }
   }, [isAuthenticated]);

   return (
      <div>
         {stateisAuthenticated ? (
            <>
               <Link href="/profile">
                  <span className="p-2 float-left cursor-pointer hover:text-brand-color">
                     <UserOutlined />
                     <span className="hidden md:inline "> Profile</span>
                  </span>
               </Link>
               <span
                  className="p-2 float-left cursor-pointer hover:text-brand-color"
                  onClick={async () => {
                     await AuthService.logout();
                     await dispatch(logout_r());
                     setStateisAuthenticated(false);
                     removeCookies("isuser");
                     router.push("/");
                  }}
               >
                  <LogoutOutlined />
                  <span className="hidden md:inline  "> Logout </span>
               </span>
            </>
         ) : (
            <>
               <span
                  className="p-2 float-left cursor-pointer hover:text-brand-color"
                  onClick={() => setOpenModalLogin(true)}
               >
                  <LoginOutlined /> <span className="hidden md:inline ">Login</span>
               </span>
               <span
                  className="p-2 float-left cursor-pointer hover:text-brand-color"
                  onClick={() => setOpenModalSignup(true)}
               >
                  <UserAddOutlined />{" "}
                  <span className="hidden md:inline ">Sign Up</span>
               </span>
            </>
         )}

         <Modal
            title="Login"
            visible={openModalLogin}
            onOk={() => setConfirmLoadingLogin(true)}
            confirmLoading={confirmLoadingLogin}
            onCancel={() => setOpenModalLogin(false)}
            footer={null}
         >
            <LoginForm
               onSubmitLogin={onSubmitLogin}
               handleCancelLogin={() => setOpenModalLogin(false)}
            />
         </Modal>

         <Modal
            title="Signup"
            visible={openModalSignup}
            onOk={() => setConfirmLoadingSignup(true)}
            confirmLoading={confirmLoadingSignup}
            onCancel={() => setOpenModalSignup(false)}
            footer={null}
         >
            <RegisterForm onSubmitSignup={onSubmitSignup} />
         </Modal>
      </div>
   );
};

export default AuthControls;
