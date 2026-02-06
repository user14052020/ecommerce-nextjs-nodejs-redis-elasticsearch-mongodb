import { useEffect } from "react";
import { Form, message } from "antd";
import { isAuthenticated_r, login_r } from "@app/entities/user/model/actions";
import axios from "axios";
import { API_URL } from "@root/config";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import AuthService from "@app/entities/user/api/authService";
import { setCookies } from "cookies-next";
import type { LoginState } from "@app/entities/user/model/types";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@app/features/auth/ui/LoginForm"));
const RegisterForm = dynamic(() => import("@app/features/auth/ui/RegisterForm"));

type AuthPayload = {
   username: string;
   password: string;
   [key: string]: unknown;
};

const SignInPage = () => {
   const [form] = Form.useForm();

   const dispatch = useDispatch();
   const { isAuthenticated } = useSelector(
      (state: { login: LoginState }) => state.login
   );

   useEffect(() => {
      if (isAuthenticated) {
         void Router.push("/");
      }
   }, [isAuthenticated]);

   const onSubmitSignup = (Data: AuthPayload) => {
      Data["username"] = Data.username.toLowerCase();

      axios
         .post(`${API_URL}/users/register`, Data)
         .then((res) => {
            if (res.data.error) {
               message.error(res.data.messagge);
            } else {
               form.resetFields();
               message.success(res.data.messagge);
               onSubmitLogin(Data);
            }
         })
         .catch((err) => console.log("err", err));
   };

   const handleCancelLogin = () => { };

   const onSubmitLogin = (Data: AuthPayload) => {
      Data["username"] = Data.username.toLowerCase();

      AuthService.login(Data).then((data) => {
         const { isAuthenticated, user } = data;

         if (isAuthenticated) {
            dispatch(login_r(user));
            dispatch(isAuthenticated_r(true));
            Router.push("/");
            message.success("Login Successfully");
            setCookies("isuser", true);
            handleCancelLogin();
         } else {
            message.error("Login not Successfully");
         }
      });
   };

   return (
      <>
         <div className="grid container-custom gap-10 p-20 grid-cols-12">
            <div className="col-span-6">
               <div className="text-lg font-semibold col-span-12 text-brand-color  mb-5 ">
                  Login{" "}
               </div>
               <LoginForm
                  onSubmitLogin={onSubmitLogin}
                  handleCancelLogin={handleCancelLogin}
               />
            </div>

            <div className="col-span-6">
               <div className="text-lg font-semibold col-span-12 text-brand-color  mb-5 ">
                  Register{" "}
               </div>
               <RegisterForm onSubmitSignup={onSubmitSignup} />
            </div>
         </div>
      </>
   );
};

export default SignInPage;
