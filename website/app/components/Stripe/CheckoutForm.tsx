import { useEffect, useState } from "react";
import {
   PaymentElement,
   useStripe,
   useElements,
} from "@stripe/react-stripe-js";
import { Checkbox, Button, Form, Input } from "antd";
import router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getBasket_r, updateBasket_r } from "@app/redux/actions";
import axios from "axios";
import { API_URL } from "@root/config";
import type { AppDispatch, RootState } from "@app/redux/store";
import type { LoginUser } from "@app/redux/types";

type CheckoutFormProps = {
   contract: string;
};

type ReceiverFormValues = {
   name: string;
   email: string;
   phone: string;
};

type StripeIntentResponse = {
   payment_intent: string;
   ordernumber: string;
};

export default function CheckoutForm({ contract }: CheckoutFormProps) {
   const stripe = useStripe();
   const elements = useElements();
   const dispatch = useDispatch<AppDispatch>();
   const { basket } = useSelector((state: RootState) => state.basket);
   const { user, isAuthenticated } = useSelector((state: RootState) => state.login);
   const [message, setMessage] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [isChecked, setIsChecked] = useState(false);

   useEffect(() => {
      if (!stripe) {
         return;
      }

      const clientSecret = new URLSearchParams(window.location.search).get(
         "payment_intent_client_secret"
      );

      if (!clientSecret) {
         return;
      }

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
         switch (paymentIntent?.status) {
         case "succeeded":
            setMessage("Payment succeeded!");
            break;
         case "processing":
            setMessage("Your payment is processing.");
            break;
         case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
         default:
            setMessage("Something went wrong.");
            break;
         }
      });
   }, [stripe, user]);

   const handleSubmit = async (data: ReceiverFormValues) => {
      const basketRecord = basket[0];
      if (!basketRecord) {
         return;
      }
      basketRecord.receiver_name = data.name;
      basketRecord.receiver_email = data.email;
      basketRecord.receiver_phone = data.phone;

      if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
         return;
      }

      setIsLoading(true);

      stripe
         .confirmPayment({
            elements,
            redirect: "if_required",
         })
         .then(async (res) => {
            if (res.error) {
               setMessage(res.error.message || "Payment failed");
            } else {
               if (basketRecord.products.length > 0) {
                  const arrayId: string[] = [];

                  basketRecord.products.map((x) => {
                     arrayId.push(x.product_id);
                  });
                  basketRecord.payment_intent = res.paymentIntent?.id || "";
                  const id = basketRecord._id;
                  delete basketRecord._id;
                  const dataRes = await axios.post<StripeIntentResponse>(
                     `${API_URL}/payment/stripeokey`,
                     {
                        ids: arrayId,
                        items: basketRecord.products,
                        basket: basket,
                     }
                  );
                  const responseData = dataRes.data;

                  basketRecord.products = [];
                  basketRecord.cargoes_id = null;
                  basketRecord.total_price = 0;
                  basketRecord.total_discount = 0;
                  basketRecord.cargo_price = 0;
                  basketRecord.cargo_price_discount = 0;

                  if (isAuthenticated) {
                     const { payment_intent, ...basketPayload } = basketRecord;
                     await axios
                        .post(`${API_URL}/basket/${id}`, basketPayload)
                        .then(async () => {
                           await dispatch(getBasket_r(user.id || null));
                           router.push(
                              "/basket/paymentokey?payment_intent=" +
                      responseData.payment_intent +
                      "&ordernumber=" +
                      responseData.ordernumber
                           );
                        })
                        .catch((err) => {
                           console.log(err);
                        });
                  } else {
                     await dispatch(updateBasket_r([basketRecord]));
                     router.push(
                        "/basket/paymentokey?payment_intent=" +
                  responseData.payment_intent +
                  "&ordernumber=" +
                  responseData.ordernumber
                     );
                  }
               }
            }
         });

      setIsLoading(false);
   };
   return (
      <Form onFinish={handleSubmit} layout="vertical">
         <div className="grid grid-cols-12 lg:gap-10 lg:m-10 lg:p-0 p-5 ">
            <div className="lg:col-span-4 col-span-12 ">
               <div className="text-lg font-semibold col-span-12 text-brand-color  mb-5  mt-5">
            Receiver{" "}
               </div>
               <Form.Item
                  name="name"
                  label="Name"
                  className="col-span-4 mb-3"
                  initialValue={(user as LoginUser).name}
                  rules={[
                     {
                        required: true,
                        message: "Please Fill",
                     },
                  ]}
               >
                  <Input size="large" className="p-2" />
               </Form.Item>
               <Form.Item
                  name="email"
                  label="E-mail"
                  className="col-span-4 mb-3"
                  initialValue={(user as LoginUser).username}
                  rules={[
                     {
                        type: "email",
                        message: "input not valid",
                     },
                     {
                        required: true,
                        message: "The input is not valid E-mail!",
                     },
                  ]}
               >
                  <Input size="large" className="p-2" />
               </Form.Item>
               <Form.Item
                  name="phone"
                  label="Phone"
                  className="col-span-4 mb-3"
                  initialValue={
                     (user as LoginUser).phone
                        ? `${(user as LoginUser).prefix || ""}${(user as LoginUser).phone}`
                        : ""
                  }
                  rules={[
                     {
                        required: true,
                        message: "Please Fill",
                     },
                  ]}
               >
                  <Input size="large" className="p-2" />
               </Form.Item>
            </div>
            <div className="lg:col-span-8 col-span-12">
               <div className="text-lg font-semibold    text-brand-color  mt-5">
            Stripe Payment{" "}
               </div>
               <PaymentElement className="  mt-5" />
            </div>
            <div className="col-span-12">
               <div className="text-lg font-semibold    text-brand-color">
            Contract
               </div>
               <div className=" overflow-y-scroll h-36   my-2 bg-gray-50 text-gray-500 p-7 rounded-t-none  rounded-lg w-auto">
                  {contract}
               </div>

               <Checkbox
                  className=" w-auto   my-4 "
                  onChange={() => {
                     setIsChecked(!isChecked);
                  }}
                  checked={isChecked}
               >
            I accept the contract
               </Checkbox>
               {message && (
                  <div className="text-red-600 font-semibold text-center text-xl m-10">
                     {message}
                  </div>
               )}
               <div className="  ">
                  <Button
                     disabled={(!isChecked && !isLoading) || !stripe || !elements}
                     className="bg-black  focus:bg-black  w-full h-auto mb-5   cursor-pointer hover:text-white hover:bg-brand-color transition-all text-xl text-white focus:text-white p-5"
                     htmlType="submit"
                  >
                     <span id="button-text">
                        {isLoading ? (
                           <div className="spinner" id="spinner"></div>
                        ) : (
                           "Pay now"
                        )}
                     </span>
                  </Button>
               </div>
            </div>
         </div>
         {/* Show any error or success messages */}
      </Form>
   );
}
