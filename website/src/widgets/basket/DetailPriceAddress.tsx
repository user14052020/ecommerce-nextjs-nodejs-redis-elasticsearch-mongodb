import axios from "axios";
import { useState, useEffect } from "react";
import router from "next/router";
import { Button, Divider, message } from "antd";
import PriceView from "@root/shared/ui/Price";
import { CheckSquareOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "@root/config";
import { getBasket_r } from "@app/entities/basket/model/actions";
import type { LoginState } from "@app/entities/user/model/types";
import type { SettingsState } from "@root/shared/types/common";
import type { BasketAddress, BasketState } from "@app/entities/basket/model/types";
import type {
   AllPrice,
   CargoItem,
   ProductData,
   SelectedCargo,
} from "@app/entities/basket/model/types";
import { calculateBasketTotals } from "@app/entities/basket/lib/calculateBasketTotals";

const Default = () => {
   const { basket } = useSelector((state: { basket: BasketState }) => state.basket);
   const { user } = useSelector((state: { login: LoginState }) => state.login);
   const { settings } = useSelector(
      (state: { settings: SettingsState }) => state.settings
   );
   const priceIcon = typeof settings.price_icon === "string" ? settings.price_icon : "";
   const priceType = Boolean(settings.price_type);
   const [billingAddress, setBillingAddress] = useState<BasketAddress | null>(null);
   const [shippingAddress, setShippingAddress] = useState<BasketAddress | null>(
      null
   );
   const [selectedCargo, setSelectedCargo] = useState<SelectedCargo>({
      cargo_price_discount: 0,
      cargo_price: 0,
      selectedCargo: null,
   });
   const [allPrice, setAllPrice] = useState<AllPrice<string | null>>({
      total: 0,
      discount: 0,
      cargo_price: 0,
      cargo_price_discount: 0,
   });
   const dispatch = useDispatch();

   const getBasketProducts = (
      data: ProductData[] = [],
      products: BasketState["basket"][0]["products"] = []
   ) => {
      const { total, discount, errorMessages } = calculateBasketTotals(
         data,
         products
      );
      setAllPrice((prev) => ({
         total,
         discount,
         cargo_price: prev.cargo_price,
         cargo_price_discount: prev.cargo_price_discount,
         error: errorMessages,
      }));
   };

   const getProducts = async () => {
      const basketRecord = basket[0];
      if (basketRecord) {
         const arrayId: string[] = [];
         basketRecord.products.map((x) => {
            arrayId.push(x.product_id);
         });
         await axios
            .post<ProductData[]>(`${API_URL}/basket/allproducts`, { _id: arrayId })
            .then((res) => {
               getBasketProducts(res.data, basketRecord.products);
            });
         setBillingAddress(basketRecord.billing_address || null);
         setShippingAddress(basketRecord.shipping_address || null);
      }
   };

   const getCargoes = async () => {
      await axios.get<CargoItem[]>(`${API_URL}/cargoespublic`).then((res) => {
         const basketRecord = basket[0];
         if (basketRecord) {
            if (basketRecord.cargoes_id) {
               setSelectedCargo({
                  cargo_price: Number(basketRecord.cargo_price),
                  cargo_price_discount: Number(basketRecord.cargo_price_discount),
                  selectedCargo: basketRecord.cargoes_id,
               });
            } else {
               const firstCargo = res.data[0];
               if (firstCargo) {
                  setSelectedCargo({
                     cargo_price: firstCargo.price,
                     cargo_price_discount: firstCargo.before_price,
                     selectedCargo: firstCargo._id,
                  });
               }
            }
         }
      });
   };

   const onSubmit = async () => {
      const basketRecord = basket[0];
      if (!basketRecord) {
         return;
      }
      const arrayId: string[] = [];
      basketRecord.products.map((x) => {
         arrayId.push(x.product_id);
      });
      const res = await axios.post<ProductData[]>(
         `${API_URL}/basket/allproducts`,
         { _id: arrayId }
      );
      const { errorFlags } = calculateBasketTotals(res.data, basketRecord.products);
      const hasError = errorFlags.some(Boolean);
      if (!hasError) {
         router.push("/basket/payment");
      } else {
         dispatch(getBasket_r(user.id || null));
         message
            .loading("Action in progress..", 0.5)
            .then(() => message.error("Please Control Your Basket", 2.5));
         router.push("/basket");
      }
   };

   useEffect(() => {
      getCargoes();
      getProducts();
   }, [basket[0]]);

   return (
      <div className="h-full relative">
         <div className=" h-20">
            <Button
               disabled={billingAddress && shippingAddress ? false : true}
               className="bg-black w-full h-auto absolute top-0 cursor-pointer hover:text-white hover:bg-brand-color transition-all text-xl text-white p-5"
               onClick={onSubmit}
            >
          Save and Continue
               <CheckSquareOutlined className="float-right text-3xl" />
            </Button>
         </div>

         <div className="text-lg p-3 -mt-2 bg-gray-50 font-semibold">
        Shipping Address Summary
         </div>

         <div className="w-full p-4">
            {shippingAddress ? (
               <>
                  <b>{shippingAddress.name} </b>
                  <br />
                  <div className="flex w-full justify-between pt-1 ">
                     {shippingAddress.address}
                     <br />
                     {shippingAddress.village_id}/{shippingAddress.town_id}/
                     {shippingAddress.city_id}/{shippingAddress.country_id}
                  </div>
               </>
            ) : (
               <div className="text-red-500 text-center font-semibold p-4">
            Please Select Address
               </div>
            )}
         </div>

         <div className="text-lg p-3  bg-gray-50 font-semibold">
        Billing Address Summary
         </div>

         <div className="w-full p-4 ">
            {billingAddress ? (
               <>
                  <b>{billingAddress.name} </b>
                  <br />
                  <div className="flex w-full justify-between pt-1 ">
                     {billingAddress.address}
                     <br />
                     {billingAddress.village_id}/{billingAddress.town_id}/
                     {billingAddress.city_id}/{billingAddress.country_id}
                  </div>
               </>
            ) : (
               <div className="text-red-500 text-center font-semibold p-4">
            Please Select Address
               </div>
            )}
         </div>

         <div className="text-lg p-3  bg-gray-50 font-semibold">Cargo Summary</div>

         <div className="w-full px-4 ">
            {selectedCargo.cargo_price_discount > 0 ? (
               <div className="w-full  mt-3 ">
                  <span>Cargo Discount:</span>
                  <span className="float-right font-semibold line-through">
                     <PriceView
                        value={selectedCargo.cargo_price_discount}
                        priceIcon={priceIcon}
                        priceType={priceType}
                     />
                  </span>
               </div>
            ) : (
               ""
            )}
            <div className="w-full  mt-3 ">
               <span>Cargo Price:</span>
               <span className="float-right font-semibold">
                  <PriceView
                     value={selectedCargo.cargo_price}
                     priceIcon={priceIcon}
                     priceType={priceType}
                  />
               </span>
            </div>
         </div>

         <div className="text-lg p-3 my-5 bg-gray-50 font-semibold">
        Basket Summary
         </div>
         {allPrice.discount + selectedCargo.cargo_price_discount > 0 ? (
            <>
               <div className="w-full px-4 mt-1">
                  <span>Total Discount:</span>
                  <span className="float-right  line-through font-semibold">
                     <PriceView
                        value={allPrice.discount + selectedCargo.cargo_price_discount}
                        priceIcon={priceIcon}
                        priceType={priceType}
                     />
                  </span>
               </div>
               <Divider />
            </>
         ) : (
            ""
         )}
         <div className="w-full px-4 text-lg mb-6">
            <span>Total Price:</span>
            <span className="float-right font-semibold text-brand-color">
               <PriceView
                  value={allPrice.total + selectedCargo.cargo_price}
                  priceIcon={priceIcon}
                  priceType={priceType}
               />
            </span>
         </div>
         <div className=" h-20">
            <Button
               disabled={billingAddress && shippingAddress ? false : true}
               className="bg-black w-full h-auto absolute bottom-0 cursor-pointer hover:text-white hover:bg-brand-color transition-all text-xl text-white p-5"
               onClick={onSubmit}
            >
          Save and Continue
               <CheckSquareOutlined className="float-right text-3xl" />
            </Button>
         </div>
      </div>
   );
};

export default Default;
