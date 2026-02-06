import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import filterRouteLinkGenerate from "@app/features/filter-products/lib/filterRouterLink";

import { filterProducts_r } from "@app/features/filter-products/model/actions";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { BrandsState, BrandItem } from "@app/entities/brands/model/types";
import type { FilterProductsState } from "@app/features/filter-products/model/types";

type BrandOption = {
   label: string;
   value: string;
};

const Page = () => {
   const { brands } = useSelector((state: { brands: BrandsState }) => state.brands);
   const { filterProducts } = useSelector(
      (state: { filterProducts: FilterProductsState }) => state.filterProducts
   );
   const [state, setState] = useState<{ brands: BrandOption[]; allData: BrandOption[] }>({
      brands: [],
      allData: [],
   });
   const dispatch = useDispatch();

   const getBrands = () => {
      const dataManipulate: BrandOption[] = [];
      const typedBrands = brands as BrandItem[];
      for (const i in typedBrands) {
         dataManipulate.push({
            label: typedBrands[i].title,
            value: typedBrands[i]._id,
         });
      }
      setState({ ...state, brands: dataManipulate, allData: dataManipulate });
   };

   useEffect(() => {
      getBrands();
   }, []);

   function onChange(checkedValues: CheckboxValueType[]) {
      dispatch(
         filterProducts_r({
            ...filterProducts,
            brands: checkedValues as string[],
            skip: 0,
         })
      );
      filterRouteLinkGenerate({
         ...filterProducts,
         brands: checkedValues as string[],
         skip: 0,
      });
   }

   const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
      const filterData = state.allData.filter(
         (val) =>
            val.label.toLowerCase().search(e.target.value.toLowerCase()) !== -1
      );
      setState({ ...state, brands: filterData });
   };

   return (
      <>
         <Input
            placeholder="Brands..."
            onChange={onChangeSearch}
            suffix={<SearchOutlined />}
         />
         <div className="BrandsFilter rounded-bottom">
            <Checkbox.Group
               options={state.brands}
               value={[...filterProducts.brands]}
               onChange={onChange}
            />
         </div>
      </>
   );
};

export default Page;
