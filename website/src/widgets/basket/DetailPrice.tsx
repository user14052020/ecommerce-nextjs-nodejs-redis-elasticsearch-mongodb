import axios from "axios";
import { useState, useEffect } from "react";
import router from "next/router";
import { Select, Divider, message, Button } from "antd";
import PriceView from "@root/shared/ui/Price";
import { CheckSquareOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "@root/config";
import { getBasket_r, updateBasket_r } from "@app/entities/basket/model/actions";
import type { LoginState } from "@app/entities/user/model/types";
import type { SettingsState } from "@root/shared/types/common";
import type { BasketState } from "@app/entities/basket/model/types";
import type {
   AllPrice,
   CargoItem,
   ProductData,
   SelectedCargo,
} from "@app/entities/basket/model/types";
import { calculateBasketTotals } from "@app/entities/basket/lib/calculateBasketTotals";

const Default = () => {
   const { basket } = useSelector((state: { basket: BasketState }) => state.basket);
   const { isAuthenticated, user } = useSelector(
      (state: { login: LoginState }) => state.login
   );
   const { settings } = useSelector(
      (state: { settings: SettingsState }) => state.settings
   );
   const priceIcon = typeof settings.price_icon === "string" ? settings.price_icon : "";
   const priceType = Boolean(settings.price_type);
   const [cargoes, setCargoes] = useState<CargoItem[]>([]);
   const [selectedCargo, setSelectedCargo] = useState<SelectedCargo>({
      cargo_price_discount: 0,
      cargo_price: 0,
      selectedCargo: null,
   });
   const [allPrice, setAllPrice] = useState<AllPrice<boolean>>({
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
      const { total, discount, errorFlags } = calculateBasketTotals(data, products);
      setAllPrice((prev) => ({
         total,
         discount,
         cargo_price: prev.cargo_price,
         cargo_price_discount: prev.cargo_price_discount,
         error: errorFlags,
      }));
   };

   const getProducts = async () => {
      if (basket.length > 0) {
         const arrayId: string[] = [];
         basket[0].products.map((x) => {
            arrayId.push(x.product_id);
         });
         await axios
            .post<ProductData[]>(`${API_URL}/basket/allproducts`, { _id: arrayId })
            .then((res) => {
               getBasketProducts(res.data, basket[0].products);
            });
      }
   };

   const getCargoes = async () => {
      await axios.get<CargoItem[]>(`${API_URL}/cargoespublic`).then((res) => {
         setCargoes(res.data);
         if (basket.length > 0) {
            if (basket[0].cargoes_id) {
               setSelectedCargo({
                  cargo_price: Number(basket[0].cargo_price),
                  cargo_price_discount: Number(basket[0].cargo_price_discount),
                  selectedCargo: basket[0].cargoes_id,
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
         const post = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,

            products: basket[0].products,
            cargoes_id: selectedCargo.selectedCargo,
            total_price: allPrice.total,
            total_discount: allPrice.discount,
            cargo_price: selectedCargo.cargo_price,
            cargo_price_discount: selectedCargo.cargo_price_discount,
         };

         if (isAuthenticated) {
            axios
               .post(`${API_URL}/basket/${basket[0]._id}`, post)
               .then(async () => {
                  message.success({ content: "Next Stage :)", duration: 3 });
                  await dispatch(getBasket_r(user.id || null));
               })
               .catch((err) => {
                  message.error({
                     content: "Some Error, Please Try Again",
                     duration: 3,
                  });
                  console.log(err);
               });
         } else {
            message.success({ content: "Next Stage :)", duration: 3 });
            dispatch(updateBasket_r([post]));
            getProducts();
         }
         router.push("/basket/address");
      } else {
         dispatch(getBasket_r(user.id || null));
         message
            .loading("Action in progress..", 0.5)
            .then(() => message.error("Please Control Your Basket", 2.5));
      }
   };

   const changeCargo = (newValue: string) => {


      const cargo = cargoes.find((x) => x._id == newValue);
      if (!cargo) {
         return;
      }

      const post = {
         created_user: {
            name: user.name,
            id: user.id,
         },
         customer_id: user.id,
         products: basket[0].products,
         total_price: allPrice.total,
         cargo_price: cargo.price,
         cargo_price_discount: cargo.before_price,
         cargoes_id: newValue,
         total_discount: allPrice.discount,
      };

      if (isAuthenticated) {
         axios
            .post(`${API_URL}/basket/${basket[0]._id}`, post)
            .then(async () => {
               message.success({ content: "Cargo Update!", duration: 3 });
               await dispatch(getBasket_r(user.id || null));
               setSelectedCargo({
                  cargo_price: cargo.price,
                  cargo_price_discount: cargo.before_price,
                  selectedCargo: newValue,
               });
            })
            .catch((err) => {
               message.error({
                  content: "Some Error, Please Try Again",
                  duration: 3,
               });
               console.log(err);
            });
      } else {
         message.success({ content: "Cargo Update!", duration: 3 });
         dispatch(updateBasket_r([post]));
         setSelectedCargo({
            cargo_price: cargo.price,
            cargo_price_discount: cargo.before_price,
            selectedCargo: newValue,
         });
         getProducts();
      }
   };

   useEffect(() => {
      getCargoes();
      getProducts();
   }, [basket[0]]);

   return (
      <div className="h-full relative">
         <div className="h-20">
            <Button
               disabled={basket[0]?.products.length > 0 ? false : true}
               className="bg-black w-full h-auto absolute top-0 cursor-pointer hover:text-white hover:bg-brand-color transition-all text-xl text-white p-5"
               onClick={onSubmit}
            >
          Confirm Basket
               <CheckSquareOutlined className="float-right text-3xl" />
            </Button>
         </div>
         <div className="text-lg p-3 bg-gray-50 font-semibold">Cargo Summary</div>

         <div className="w-full px-4 ">
            <div className="w-full float-left mb-2  flex">
               <div className="w-full my-1">Cargo Company:</div>
               <div className="w-full">
                  <Select
                     className="float-right w-full -mr-4"
                     value={selectedCargo.selectedCargo ?? undefined}
                     bordered={false}
                     onChange={(newValue: string) => changeCargo(newValue)}
                  >
                     {cargoes.map((data) => (
                        <Select.Option key={data.title} value={data._id}>
                           {data.title}
                        </Select.Option>
                     ))}
                  </Select>
               </div>
            </div>
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
         <div className="h-24">
            <Button
               disabled={basket[0]?.products.length > 0 ? false : true}
               className="bg-black w-full h-auto absolute bottom-0 cursor-pointer hover:text-white hover:bg-brand-color transition-all text-xl text-white p-5"
               onClick={onSubmit}
            >
          Confirm Basket
               <CheckSquareOutlined className="float-right text-3xl" />
            </Button>
         </div>
      </div>
   );
};

export default Default;
