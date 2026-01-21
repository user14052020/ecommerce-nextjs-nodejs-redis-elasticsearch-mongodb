import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber } from "antd";
import filterRouteLinkGenerate from "@app/app/components/FilterProducts/filterRouterLink";
import { filterProducts_r } from "@app/redux/actions";
import type { AppDispatch, RootState } from "@app/redux/store";
import type { FilterProductsPayload } from "@app/redux/types";

type PriceFormValues = {
   minPrice?: number | null;
   maxPrice?: number | null;
};

const Page = () => {
   const { filterProducts } = useSelector(
      ({ filterProducts }: RootState) => filterProducts
   );
   const [state, setState] = useState<FilterProductsPayload>(filterProducts);
   const dispatch = useDispatch<AppDispatch>();

   useEffect(() => {
      setState(filterProducts);
   }, [filterProducts]);

   const onChange = (Data?: PriceFormValues) => {
      if (Data) {
         setState({
            ...state,
            minPrice: Data.minPrice ?? null,
            maxPrice: Data.maxPrice ?? null,
         });
         dispatch(
            filterProducts_r({
               ...filterProducts,
               minPrice: Data.minPrice ?? null,
               maxPrice: Data.maxPrice ?? null,
               skip: 0,
            })
         );
         filterRouteLinkGenerate({
            ...filterProducts,
            minPrice: Data.minPrice ?? null,
            maxPrice: Data.maxPrice ?? null,
            skip: 0,
         });
      }
   };

   const InputsPrices = ({ className }: { className?: string }) => (
      <Input.Group compact className={className}>
         <Form.Item name="minPrice" style={{ width: "42%" }}>
            <InputNumber placeholder="Minimum" min={0} className="w-full" />
         </Form.Item>
         <Form.Item name="maxPrice" style={{ width: "42%" }}>
            <InputNumber min={0} placeholder="Maximum" className="w-full" />
         </Form.Item>
         <Button
            style={{ width: "16%" }}
            onClick={() => onChange()}
            type="primary"
            htmlType="submit"
            className="m-0 p-1 bg-brand-color"
         >
            <SearchOutlined />
         </Button>
      </Input.Group>
   );

   return (
      <>
         <div className="float-left w-full   my-3">
            <h6 className="mt-4 ">Price </h6>
            <Form
               onFinish={onChange}
               fields={Object.entries(state).map(([name, value]) => ({
                  name,
                  value,
               }))}
            >
               <InputsPrices className="w-full bg-brand-color" />
            </Form>
         </div>
      </>
   );
};

export default Page;
