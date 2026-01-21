import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider, Radio, Form } from "antd";
import { getBasket_r } from "@app/redux/actions";
import Price from "@app/app/components/Price";
import AddProductButton from "@app/app/components/ProductDetail/AddProductButton";
import func from "@app/util/helpers/func";
import type { AppDispatch, RootState } from "@app/redux/store";
import type { BasketState } from "@app/redux/types";

type VariantOption = {
   name: string;
   value: string[];
};

type VariantProduct = {
   price: number;
   before_price: number;
   qty: number | string;
   visible: boolean;
   [key: string]: unknown;
};

type ProductData = {
   _id: string;
   title: string;
   description_short?: string;
   type?: boolean;
   price?: number;
   before_price?: number;
   variants?: VariantOption[];
   variant_products?: VariantProduct[];
   selectedVariants?: Record<string, string>;
   seo: string;
};

type PoductVariantsProps = {
   data?: ProductData;
};

const Page = ({ data }: PoductVariantsProps) => {
   const { isAuthenticated, user } = useSelector((state: RootState) => state.login);
   const { basket } = useSelector((state: RootState) => state.basket);
   const state = data || ({} as ProductData);

   const [loadingButton, setLoadingButton] = useState(true);
   const [disabledVariant, setDisabledVariant] = useState(true);
   const [priceAdd, setPriceAdd] = useState({
      before_price: 0,
      price: 0,
      qty: 1,
   });

   const [form] = Form.useForm();

   const dispatch = useDispatch<AppDispatch>();
   // const seo = router.query.seo

   const getBasket = (id: string | null) => {
      dispatch(getBasket_r(id));
   };

   useEffect(() => {
      getBasket(user.id || null);
   }, []);

   const onFinishFailed = (errorInfo: unknown) => {
      console.log(errorInfo);
   };
   const getVariantPrice = (data: VariantProduct[]) => {
      if (data.length > 0) {
         const newData = data.sort((a, b) => {
            return a.price - b.price;
         });
         return (
            <span>
               <Price data={newData[0].price} /> -{" "}
               <Price data={newData[data.length - 1].price} />{" "}
            </span>
         );
      }
      return null;
   };

   return (
      <div className="lg:pl-10 px-2">
         <h2 className="font-semibold   mt-5">{state.title}</h2>
         <h3 className="text-gray-500">{state.description_short}</h3>
         <div className="my-4 w-full">
            {state.type ? (
               <>
                  {disabledVariant ? (
                     <h1 className=" text-brand-color font-semibold text-2xl">
                        {priceAdd.price != 0 ? (
                           <Price data={priceAdd.price} />
                        ) : (
                           getVariantPrice(state.variant_products || [])
                        )}

                        {priceAdd.before_price != 0 &&
                  priceAdd.before_price > priceAdd.price ? (
                              <span className="line-through ml-3 text-sm text-black">
                                 <Price data={priceAdd.before_price} />
                              </span>
                           ) : (
                              ""
                           )}
                     </h1>
                  ) : (
                     <h2 className="text-red-500">This is variant not shipping.</h2>
                  )}
               </>
            ) : (
               <h1 className="text-brand-color font-semibold text-2xl">
                  {disabledVariant ? (
                     <>
                        <Price data={state.price} />

                        {state.before_price != 0 ? (
                           <span className="line-through ml-3 text-sm text-black">
                              <Price data={state.before_price} />
                           </span>
                        ) : (
                           ""
                        )}
                     </>
                  ) : (
                     ""
                  )}
               </h1>
            )}
         </div>
         <div>
               <Form
                  form={form}
                  name="add"
                  onFinishFailed={onFinishFailed}
                  scrollToFirstError
                  layout="vertical"
                  className="w-full "
               >
               {state.type ? (
                  <>
                     <Divider />

                     {state.variants?.map((x) => (
                        <div key={x.name}>
                           <Form.Item
                              name={x.name}
                              label={
                                 form.getFieldValue(x.name) ? (
                                    <span className="font-normal">
                                       {x.name} :
                                       <span className="font-semibold">
                                          {" "}
                                          {form.getFieldValue(x.name)}{" "}
                                       </span>
                                    </span>
                                 ) : (
                                    <span className="font-normal">
                                       {x.name} :
                                       <span className="text-gray-500"> Please Select</span>
                                    </span>
                                 )
                              }
                              labelAlign="left"
                              className="mb-0 pb-0 mt-5 "
                              rules={[
                                 {
                                    required: true,
                                    message: "Please Select",
                                    whitespace: true,
                                 },
                              ]}
                           >
                              <Radio.Group
                                 name={x.name}
                                 optionType="button"
                                 buttonStyle="outline"
                                 className="pl-2 mt-2 mb-1 "
                                 onChange={(y) => {
                                    const data = state;
                                    const nextSelectedVariants = {
                                       ...(data.selectedVariants || {}),
                                       [x.name]: String(y.target.value),
                                    };
                                    data.selectedVariants = nextSelectedVariants;
                                    const priceMath = func.filter_array_in_obj(
                                       data.variant_products ?? [],
                                       data.selectedVariants
                                    ) as VariantProduct[];

                                    if (priceMath.length == 1) {
                                       if (String(priceMath[0].qty) == "0") {
                                          setDisabledVariant(false);
                                       } else if (priceMath[0].visible) {
                                          setDisabledVariant(true);
                                       } else {
                                          setDisabledVariant(false);
                                       }
                                    }

                                    setPriceAdd({
                                       qty: priceAdd.qty,
                                       price: priceMath[0].price * priceAdd.qty,
                                       before_price:
                            priceMath[0].before_price * priceAdd.qty,
                                    });
                                 }}
                              >
                                 {x.value.map((z) => {
                                    return (
                                       <Radio.Button key={z} value={z}>
                                          {z}
                                       </Radio.Button>
                                    );
                                 })}
                              </Radio.Group>
                           </Form.Item>
                        </div>
                     ))}
                  </>
               ) : (
                  ""
               )}

               {/* <label>Adet: <br /></label>
                            <div>
                                <Input type="number" onChange={x => {

                                    setPriceAdd({
                                        qty: x.target.value,
                                        price: state.price * x.target.value,
                                        before_price: state.before_price * x.target.value
                                    })

                                }}
                                    value={priceAdd.qty}
                                />
                            </div> */}
               <Divider />
               <AddProductButton
                  disabledVariant={disabledVariant}
                  form={form}
                  setLoadingButton={setLoadingButton}
                  loadingButton={loadingButton}
                  basket={basket}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  state={state}
                  priceAdd={priceAdd}
                  getBasket={getBasket}
               />
            </Form>
            <Divider />
         </div>
      </div>
   );
};

export default Page;
