import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL, PAYMENT_STRIPE_METHOD_ID } from "@root/config";
import type { RootState } from "@app/redux/store";


import dynamic from "next/dynamic";

const Head = dynamic(() => import("@app/app/core/Head"));
const DetailPricePay = dynamic(() => import("@app/app/components/Basket/DetailPricePay"));
const StripeComponent = dynamic(() => import("@app/app/components/Stripe"));

type PaymentMethod = {
   public_key: string;
   contract: string;
};

const Page = () => {
   const { basket } = useSelector((state: RootState) => state.basket);
   const [public_key, setPublic_key] = useState("");
   const [contract, setContract] = useState("");

   const getPaymentMethodStripe = () => {
      axios
         .get<PaymentMethod[]>(
            `${API_URL}/paymentmethodspublic/${PAYMENT_STRIPE_METHOD_ID}`
         )
         .then((res) => {
            const method = res.data[0];
            setPublic_key(method?.public_key || "");
            setContract(method?.contract || "");
         });
   };
   useEffect(() => {
      getPaymentMethodStripe();
   }, [basket[0], public_key]);

   return (
      <div className="container-custom h-full grid grid-cols-12 ">
         <Head title="Payments" />
         <div className="col-span-12 lg:col-span-9 shadow-lg m-4 grid-cols-2 my-8 gap-9 py-5 bg-white order-2 lg:order-1">
            <StripeComponent
               basket={basket}
               public_key={public_key}
               contract={contract}
            />
         </div>
         <div className=" col-span-12 lg:col-span-3 shadow-lg m-4 grid-cols-2 bg-white my-8 gap-9 order-1 lg:order-2">
            <DetailPricePay />
         </div>
      </div>
   );
};

export default Page;
