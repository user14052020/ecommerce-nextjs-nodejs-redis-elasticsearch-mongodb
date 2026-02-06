import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CloseCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { filterProducts_r } from "@app/features/filter-products/model/actions";
import type {
   FilterProductsPayload,
   FilterProductsState,
} from "@app/features/filter-products/model/types";

import dynamic from "next/dynamic";

const Head = dynamic(() => import("@app/shared/ui/SeoHead"));
const FilterSelectedTop = dynamic(() => import("@app/features/filter-products/ui/FilterSelectedTop"));
const BrandsFilter = dynamic(() => import("@app/features/filter-products/ui/BrandsFilter"));
const CategoriesFilter = dynamic(() => import("@app/features/filter-products/ui/CategoriesFilter"));
const PriceFilter = dynamic(() => import("@app/features/filter-products/ui/PriceFilter"));
const FilterProductArea = dynamic(
   () => import("@app/widgets/search/FilterProductArea"),
   { ssr: false }
);
const TextFilter = dynamic(() => import("@app/features/filter-products/ui/TextFilter"));
const SortProducts = dynamic(() => import("@app/features/filter-products/ui/SortProducts"));

const Page = () => {
   const { filterProducts } = useSelector(
      (state: { filterProducts: FilterProductsState }) => state.filterProducts
   );
   const router = useRouter();
   const [openFilter, setOpenFilter] = useState(false);

   const dispatch = useDispatch();

   const normalizeArrayValue = (value?: string | string[]): string[] => {
      if (!value) {
         return [];
      }
      const list = Array.isArray(value) ? value : value.split(",");
      return list.map((item) => item.trim()).filter(Boolean);
   };

   const normalizeStringValue = (value?: string | string[]): string => {
      if (!value) {
         return "";
      }
      return Array.isArray(value) ? value[0] ?? "" : value;
   };

   const normalizeNumberValue = (value?: string | string[]): number | null => {
      if (!value) {
         return null;
      }
      const raw = Array.isArray(value) ? value[0] : value;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
   };

   const callUrltoRedux = async () => {
      const urlToRedux: Partial<FilterProductsPayload> = {
         brands: normalizeArrayValue(router.query.brands),
         categories: normalizeArrayValue(router.query.categories),
         text: normalizeStringValue(router.query.text),
         minPrice: normalizeNumberValue(router.query.minprice),
         maxPrice: normalizeNumberValue(router.query.maxprice),
      };

      await dispatch(
         filterProducts_r({
            ...filterProducts,
            ...urlToRedux,
            skip: 0,
            limit: 12,
         })
      );
   };

   useEffect(() => {
      callUrltoRedux();
   }, [router.asPath]);

   return (
      <div className="container-custom  ">
         <div className="grid grid-cols-12 h-full my-2 py-2  bg-white">
            <Head title="Search" />

            <div
               className={`md:col-span-2 col-span-12 p-2 shadow-sm border-top md:relative md:top-auto md:right-auto md:left-auto md:bottom-auto md:visible md:block
            ${openFilter
         ? " fixed overflow-scroll top-0 left-0 right-0 bottom-0 w-screen h-screen bg-white z-20 "
         : "invisible hidden"
      } `}
            >
               <div
                  className="float-right  md:hidden block"
                  onClick={() => setOpenFilter(false)}
               >
                  <CloseCircleOutlined />
               </div>
               <TextFilter />
               <CategoriesFilter />
               <PriceFilter />
               <BrandsFilter />

               <div
                  className="float-right w-full p-2 cursor-pointer  md:hidden block text-center bg-black text-white mt-10"
                  onClick={() => setOpenFilter(false)}
               >
            Filter Done
               </div>
            </div>

            <div className=" md:col-span-10  col-span-12  ">
               <div className="w-6/12 float-left">
                  <button
                     className="items-center w-full  bg-white border rounded-sm p-0.3 text-base block md:hidden"
                     onClick={() => setOpenFilter(true)}
                  >
              Open Filter <FilterOutlined />
                  </button>
               </div>
               <div className="w-6/12 md:w-2/12 pr-5 float-right">
                  <SortProducts />
               </div>
               <div className="w-full float-left   pb-0">
                  <FilterSelectedTop />
               </div>
               <div className="w-full mt-3 float-left">
                  <FilterProductArea />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Page;
