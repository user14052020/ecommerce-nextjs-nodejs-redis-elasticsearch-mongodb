import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { API_URL } from "@root/config";
import { useRouter } from "next/router";
import axios from "axios";
import dynamic from "next/dynamic";

const IntlMessages = dynamic(() => import("@app/util/IntlMessages"));

type ResetPasswordPayload = {
   password: string;
   confirm?: string;
};

const SignInPage = () => {
   const router = useRouter();
   const { token } = router.query;

   const [username, setUsername] = useState("");

   const getUserWithToken = async (resetToken: string) => {
      await axios
         .get(API_URL + "/users/reset?resetPasswordToken=" + resetToken)
         .then((res) => {
            if (res.data.message == "password reset link a-ok") {
               setUsername(res.data.username);
            }
         })
         .catch((err) => {
            message.error("password reset link is invalid or has expired " + err);
            router.push("/forgotpassword");
         });
   };

   useEffect(() => {
      if (typeof token === "string") {
         getUserWithToken(token);
      }
   }, [token]);

   const onSubmit = (Data: ResetPasswordPayload) => {
      const resetToken = typeof token === "string" ? token : "";
      axios
         .put(`${API_URL}/users/updatePasswordViaEmail`, {
            username: username,
            password: Data["password"],
            resetPasswordToken: resetToken,
         })
         .then((res) => {
            if (
               res.data.message == "password reset link is invalid or has expired"
            ) {
               message.error("password reset link is invalid or has expired");
            } else if (res.data.message == "no user exists in db to update") {
               message.error("no user exists in db to update");
            } else {
               message.success("Password Updated");
               router.push("/signin");
            }
         })
         .catch((err) => console.log(err));
   };

   return (
      <>
         <div className=" container-custom  text-center items-center py-14">
            {username ? (
               <Form
                  initialValues={{ remember: true }}
                  onFinish={onSubmit}
                  layout="vertical"
                  className="w-6/12 mx-auto"
               >
                  <Form.Item
                     name="password"
                     label="Password"
                     rules={[
                        {
                           message: "Please input your password!",
                        },
                     ]}
                     hasFeedback
                  >
                     <Input.Password />
                  </Form.Item>
                  <Form.Item
                     name="confirm"
                     label="Confirm Password"
                     dependencies={["password"]}
                     hasFeedback
                     rules={[
                        {
                           message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                           validator: (rule: unknown, value: string) => {
                              if (!value || getFieldValue("password") === value) {
                                 return Promise.resolve();
                              }
                              return Promise.reject(
                                 "The two passwords that you entered do not match!"
                              );
                           },
                        }),
                     ]}
                  >
                     <Input.Password />
                  </Form.Item>
                  <Form.Item>
                     <Button
                        type="primary"
                        className="mb-0 w-full"
                        size="large"
                        htmlType="submit"
                     >
                Update Password
                     </Button>
                  </Form.Item>
               </Form>
            ) : (
               ""
            )}

            <Button type="link" onClick={() => router.push("/signin")}>
               <IntlMessages id="app.userAuth.signIn" />
            </Button>
         </div>
      </>
   );
};

export default SignInPage;
