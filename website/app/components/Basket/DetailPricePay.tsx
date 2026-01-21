import axios from "axios";
import { useState, useEffect } from "react";
import { Divider } from "antd";
import Price from "@app/app/components/Price";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import func from "@app/util/helpers/func";
import type { RootState } from "@app/redux/store";
import type { BasketAddress } from "@app/redux/types";
import type { BasketState } from "@app/redux/types";

const Default = () => {
   type VariantProduct = {
      price: number;
      before_price: number;
      qty: number;
      visible: boolean;
   };

   type ProductData = {
      _id: string;
      isActive?: boolean;
      qty?: number;
      price: number;
      before_price: number;
      variant_products?: VariantProduct[];
   };

   type CargoItem = {
      _id: string;
      price: number;
      before_price: number;
   };

   type SelectedCargo = {
      cargo_price_discount: number;
      cargo_price: number;
      selectedCargo: string | null;
   };

   type AllPrice = {
      total: number;
      discount: number;
      cargo_price: number;
      cargo_price_discount: number;
      error?: Array<string | null>;
   };

   const { basket } = useSelector((state: RootState) => state.basket);
   const [billingAddress, setBillingAddress] = useState<BasketAddress | null>(null);
   const [shippingAddress, setShippingAddress] = useState<BasketAddress | null>(
      null
   );
   const [selectedCargo, setSelectedCargo] = useState<SelectedCargo>({
      cargo_price_discount: 0,
      cargo_price: 0,
      selectedCargo: null,
   });
   const [allPrice, setAllPrice] = useState<AllPrice>({
      total: 0,
      discount: 0,
      cargo_price: 0,
      cargo_price_discount: 0,
   });

   const getBasketProducts = (
      data: ProductData[] = [],
      products: BasketState["basket"][0]["products"] = []
   ) => {
      let basketTotalPrice = 0;
      let basketTotalDiscountPrice = 0;
      const errorArray: Array<string | null> = [];

      products.map((x) => {
         const array = data.find((y) => y._id == x.product_id);

         if (array) {
            const resData = array;
            if (x.selectedVariants !== undefined) {
               const priceMath = func.filter_array_in_obj(
                  resData.variant_products ?? [],
                  x.selectedVariants
               ) as VariantProduct[];

               if (priceMath[0]?.visible === false) {
                  errorArray.push("Product Not Active");
               } else if (Number(priceMath[0]?.qty) < Number(x.qty)) {
                  errorArray.push("Product Not in Stock");
               } else {
                  errorArray.push(null);
               }

               if (priceMath[0]) {
                  basketTotalPrice = basketTotalPrice + x.qty * priceMath[0].price;
                  basketTotalDiscountPrice =
                     basketTotalDiscountPrice + x.qty * priceMath[0].before_price;
               }
            } else {
               if (resData.isActive === false) {
                  errorArray.push("Product Not Active");
               } else if (Number(resData.qty) < Number(x.qty)) {
                  errorArray.push("Product Not in Stock");
               } else {
                  errorArray.push(null);
               }

               basketTotalPrice = basketTotalPrice + x.qty * resData.price;
               basketTotalDiscountPrice =
            basketTotalDiscountPrice + x.qty * resData.before_price;
            }
         }
      });
      setAllPrice((prev) => ({
         total: basketTotalPrice,
         discount: basketTotalDiscountPrice,
         cargo_price: prev.cargo_price,
         cargo_price_discount: prev.cargo_price_discount,
         error: errorArray,
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

   useEffect(() => {
      getCargoes();
      getProducts();
   }, [basket[0]]);

   return (
      <div className="h-full relative">
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
                     <Price data={selectedCargo.cargo_price_discount} />
                  </span>
               </div>
            ) : (
               ""
            )}
            <div className="w-full  mt-3 ">
               <span>Cargo Price:</span>
               <span className="float-right font-semibold">
                  <Price data={selectedCargo.cargo_price} />
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
                     <Price
                        data={allPrice.discount + selectedCargo.cargo_price_discount}
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
               <Price data={allPrice.total + selectedCargo.cargo_price} />
            </span>
         </div>
      </div>
   );
};

export default Default;
