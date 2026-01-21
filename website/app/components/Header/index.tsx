import { useState, useEffect } from "react";
import AuthService from "@app/util/services/authservice";
import { useDispatch, useSelector } from "react-redux";
import { login_r, isAuthenticated_r, logout_r } from "@app/redux/actions";
import { Input, Modal, Form, message, Badge } from "antd";
import router from "next/router";
import Link from "next/link";
import LoginForm from "@app/app/components/Header/LoginForm";
import RegisterForm from "@app/app/components/Header/RegisterForm";
import {
   UserOutlined,
   ShoppingCartOutlined,
   LoginOutlined,
   LogoutOutlined,
   UserAddOutlined,
} from "@ant-design/icons";
import { API_URL, IMG_URL } from "@root/config";
import axios from "axios";
import { removeCookies, setCookies } from "cookies-next";
import type { AppDispatch, RootState } from "@app/redux/store";


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

const Default = () => {
   const [form] = Form.useForm();
   const { settings } = useSelector((state: RootState) => state.settings);
   const { basket } = useSelector((state: RootState) => state.basket);
   const { isAuthenticated } = useSelector((state: RootState) => state.login);
   const [openModalLogin, setOpenModalLogin] = useState(false);
   const [confirmLoadingLogin, setConfirmLoadingLogin] = useState(false);
   const [openModalSignup, setOpenModalSignup] = useState(false);
   const [confirmLoadingSignup, setConfirmLoadingSignup] = useState(false);
   const [stateisAuthenticated, setStateisAuthenticated] = useState(false);

   const dispatch = useDispatch<AppDispatch>();

   const onSubmitSignup = (Data: RegisterPayload) => {
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

   const getImage = (value: unknown) =>
      typeof value === "string" ? value : "";

   return (
      <div className="w-full flex justify-between mb-3 ">
         <div className=" w-3/12 mr-3 md:w-2/12 md:mr-0  mt-4 md:mt-2 lg:mt-3">
            <a href="/">
               <img
                  src={`${IMG_URL + getImage(settings.image)}`}
                  width="169"
                  height="44"
                  className=" w-full sm:w-10/12 sm:mt-0 mt-3  "
                  alt="Logo"
               />
            </a>
         </div>
         <div className=" flex-auto  w-3/12 mr-3 md:w-auto md:mr-0    mt-6  px-0 sm:px-12">
            <Input.Search
               size="middle"
               placeholder="Search..."
               enterButton
               className="sm:px-10 "


               onSearch={(val) => {
                  router.push("/search?&text=" + val);
               }}
            />
         </div>
         <div className=" mt-5   text-base text-right px-0  ">
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
            <Link href="/basket">
               <a className="p-2 float-left relative">
                  {basket.length > 0 ? (
                     <div className=" float-left w-0 h-full pt-0.5 pl-0.5 -mr-0.5">
                        {basket[0].products.length > 0 ? (
                           <>
                              <div className="  rounded-full    absolute w-1 h-1 right-2 -top-1" >
                                 <Badge size="small" count={basket[0].products.length}>
                                 </Badge>
                              </div>
                           </>
                        ) : (
                           ""
                        )}
                     </div>
                  ) : (
                     ""
                  )}

                  <ShoppingCartOutlined />
                  <span className="hidden md:inline "> Basket</span>
               </a>
            </Link>
         </div>

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

export default Default;
