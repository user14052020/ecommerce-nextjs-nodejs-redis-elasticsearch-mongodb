import { useSelector, useDispatch } from "react-redux";
import { Select } from "antd";
import {
   SortAscendingOutlined,
   SortDescendingOutlined,
} from "@ant-design/icons";
import { filterProducts_r } from "@app/redux/actions";
import filterRouteLinkGenerate from "@app/app/components/FilterProducts/filterRouterLink";
import type { AppDispatch, RootState } from "@app/redux/store";

const Page = () => {
   const { filterProducts } = useSelector(
      ({ filterProducts }: RootState) => filterProducts
   );
   const dispatch = useDispatch<AppDispatch>();

   const sortItem = (data: string) => {
      const newData = JSON.parse(data) as Record<string, number>;
      dispatch(filterProducts_r({ ...filterProducts, sort: newData, skip: 0 }));
      filterRouteLinkGenerate({ ...filterProducts, sort: newData, skip: 0 });
   };

   return (
      <div className="w-full">
         <Select
            className="w-full text-center md:text-left text-base bg-white !rounded-3xl"
            placeholder="  Sort"
            defaultValue={"  Sort"}
            onChange={(newValue: string) => {
               sortItem(newValue);
            }}
         >
            <Select.Option
               key={1}
               value={JSON.stringify({ "variant_products.price": -1, price: -1 })}
            >
               <SortDescendingOutlined /> Increased Price
            </Select.Option>
            <Select.Option
               key={2}
               value={JSON.stringify({ "variant_products.price": 1, price: 1 })}
            >
               <SortAscendingOutlined /> Decreasing Price
            </Select.Option>
         </Select>
      </div>
   );
};

export default Page;
