import { useDispatch } from "react-redux";
import { message, Button } from "antd";
import {
   ShoppingCartOutlined,
   LoadingOutlined,
   CreditCardOutlined,
} from "@ant-design/icons";
import { updateBasket_r } from "@app/redux/actions";
import axios from "axios";
import { API_URL } from "@root/config";
import type { FormInstance } from "antd/es/form";
import type { Dispatch, SetStateAction } from "react";
import type { BasketState, LoginUser } from "@app/redux/types";
import { useRouter } from "next/router";
import type { AppDispatch } from "@app/redux/store";

type PriceAdd = {
   before_price: number;
   price: number;
   qty: number;
};

type ProductData = {
   _id: string;
   seo: string;
   type?: boolean;
};

type AddProductButtonProps = {
   form: FormInstance;
   disabledVariant?: boolean;
   setLoadingButton: Dispatch<SetStateAction<boolean>>;
   loadingButton: boolean;
   basket: BasketState["basket"];
   isAuthenticated: boolean;
   user: LoginUser;
   state: ProductData;
   priceAdd: PriceAdd;
   getBasket: (id: string | null) => void;
};

const Page = ({
   form,
   disabledVariant = true,
   setLoadingButton,
   loadingButton,
   basket,
   isAuthenticated,
   user,
   state,
   priceAdd,
   getBasket,
}: AddProductButtonProps) => {
   const dispatch = useDispatch<AppDispatch>();
   // const seo = router.query.seo
   const router = useRouter();

   const addBasket = (res: Record<string, string>) => {
      if (basket.length < 1) {
         const post = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,
            products: [
               {
                  product_id: state._id,
                  seo: state.seo,
                  selectedVariants: res,
                  qty: 1,
               },
            ],
            total_price: priceAdd.price,
            total_discount: priceAdd.before_price,
         };
         if (isAuthenticated) {
            axios
               .post(`${API_URL}/basket/add`, post)
               .then(() => {
                  getBasket(user.id || null);
                  setLoadingButton(true);
                  form.resetFields();
                  message.success({ content: "Product Added!", duration: 3 });
               })
               .catch((err) => {
                  message.error({
                     content: "Some Error, Please Try Again " + err,
                     duration: 3,
                  });
               });
         } else {
            setLoadingButton(true);
            form.resetFields();
            message.success({ content: "Product Added!", duration: 3 });
            dispatch(updateBasket_r([post]));
         }
      } else {
         const productsDataArray = basket[0].products;
         const productsData = [];

         if (state.type) {
            const variantControl = productsDataArray.find(
               (x) =>
                  x.product_id == state._id &&
            JSON.stringify(x.selectedVariants) == JSON.stringify(res)
            );
            const variantControlNot = productsDataArray.filter(
               (x) => JSON.stringify(x.selectedVariants) != JSON.stringify(res)
            );
            if (variantControl == undefined) {
               productsData.push(...productsDataArray, {
                  product_id: state._id,
                  selectedVariants: res,
                  seo: state.seo,
                  qty: 1,
               });
            } else {
               productsData.push(...variantControlNot, {
                  product_id: state._id,
                  selectedVariants: res,
                  seo: state.seo,
                  qty: variantControl.qty + 1,
               });
            }
         } else {
            const variantControlId = productsDataArray.find(
               (x) => x.product_id == state._id
            );
            const variantControlIdNot = productsDataArray.filter(
               (x) =>
                  JSON.stringify(x.selectedVariants) != JSON.stringify(res) &&
            x.product_id != state._id
            );

            if (variantControlId == undefined) {
               productsData.push(...productsDataArray, {
                  product_id: state._id,
                  selectedVariants: undefined,
                  seo: state.seo,
                  qty: 1,
               });
            } else {
               productsData.push(...variantControlIdNot, {
                  product_id: state._id,
                  selectedVariants: undefined,
                  seo: state.seo,
                  qty: variantControlId.qty + 1,
               });
            }
         }
         const post = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,
            products: productsData.sort(
               (a, b) =>
                  (a.seo + JSON.stringify(a.selectedVariants)).length -
            (b.seo + JSON.stringify(b.selectedVariants)).length
            ),
         };
         if (isAuthenticated) {
            axios
               .post(`${API_URL}/basket/${basket[0]._id}`, post)
               .then(() => {
                  getBasket(user.id || null);
                  setLoadingButton(true);
                  form.resetFields();
                  message.success({ content: "Product Added!", duration: 3 });
               })
               .catch((err) => {
                  message.error({
                     content: "Some Error, Please Try Again",
                     duration: 3,
                  });
                  console.log(err);
               });
         } else {
            setLoadingButton(true);
            form.resetFields();
            message.success({ content: "Product Added!", duration: 3 });
            dispatch(updateBasket_r([post]));
         }
      }
   };

   return (
      <div className=" gap-4 xl:flex lg:grid">


         <Button
            type="primary"
            className=" xl:w-8/12 w-full border-black bg-black text-2xl h-auto hover:bg-white hover:border-black hover:text-black"
            disabled={!disabledVariant}
            onClick={() => {
               form
                  .validateFields()
                  .then((res) => {
                     setLoadingButton(false);
                     if (loadingButton) {
                        addBasket(res as Record<string, string>);
                        router.push("/basket");
                     }
                  })
                  .catch((err) => console.log("err", err));
            }}
         >
        Buy Now
            {loadingButton ? (
               <CreditCardOutlined />
            ) : (
               <LoadingOutlined className="animate-spin h-5 w-5 mr-3  " />
            )}
         </Button>

         <Button
            type="primary"
            className="  xl:w-4/12 w-full border-brand-color bg-brand-color text-2xl h-auto  hover:bg-white hover:border-brand-color hover:text-brand-color"
            disabled={!disabledVariant}
            onClick={() => {
               form
                  .validateFields()
                  .then((res) => {
                     setLoadingButton(false);
                     if (loadingButton) {
                        addBasket(res as Record<string, string>);
                     }
                  })
                  .catch((err) => console.log("err", err));
            }}
         >
        Add to Basket
            {loadingButton ? (
               <ShoppingCartOutlined />
            ) : (
               <LoadingOutlined className="animate-spin h-5 w-5 mr-3  " />
            )}
         </Button>
      </div>

   );
};

export default Page;
