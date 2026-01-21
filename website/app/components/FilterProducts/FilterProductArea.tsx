import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "@app/app/components/ProductCard";
import filterRouteLinkGenerate from "@app/app/components/FilterProducts/filterRouterLink";
import axios from "axios";
import { filterProducts_r } from "@app/redux/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@app/app/components/CircularProgress";
import { API_URL } from "@root/config";
import type { AppDispatch, RootState } from "@app/redux/store";

const Page = () => {
   type ProductItem = {
      _id: string;
      seo: string;
      title: string;
      [key: string]: unknown;
   };

   const { filterProducts } = useSelector(
      ({ filterProducts }: RootState) => filterProducts
   );
   const [products, setProducts] = useState<ProductItem[]>([]);
   const [hasMore, setHasMore] = useState<boolean>(false);
   const dispatch = useDispatch<AppDispatch>();

   const getProducts = () => {
      const skip = filterProducts.skip ?? 0;
      axios
         .post<ProductItem[]>(`${API_URL}/productspublic`, filterProducts)
         .then((res) => {
            if (res.data.length > 0) {
               // setProducts([...products, ...res.data])

               if (skip == 0) {
                  setProducts(res.data);
                  if (res.data.length == 12) {
                     setHasMore(true);
                  } else {
                     setHasMore(false);
                  }

               } else {
                  setProducts([...products, ...res.data]);
                  setHasMore(false);

               }

            }
            if (res.data.length == 0 && skip == 0) {
               setProducts([]);
               setHasMore(false);
            }


         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      getProducts();
   }, [filterProducts]);

   const fetchMoreData = () => {
      const skip = filterProducts.skip ?? 0;
      const limit = filterProducts.limit ?? 0;
      const nextSkip = skip + limit;
      dispatch(
         filterProducts_r({
            ...filterProducts,
            skip: nextSkip,
            limit,
         })
      );
      filterRouteLinkGenerate({
         ...filterProducts,
         skip: nextSkip,
         limit,
      });
   };
   return (
      <>
         <div className="container  ">
            <InfiniteScroll
               dataLength={products.length}
               next={fetchMoreData}
               hasMore={hasMore}
               loader={
                  <div className="col-span-12  ">
                     <CircularProgress />
                  </div>
               }
               className="grid grid-cols-12 pb-16"
            >
               {products &&
                  products.map((data, i) => (
                     <ProductCard
                        key={i}
                        data={data}
                        className=" xl:col-span-3 lg:col-span-4 rounded-lg col-span-6 m-2 md:m-3 bg-white  group  overflow-hidden  shadow-xl hover:shadow-2xl pb-0"
                     />
                  ))}
            </InfiniteScroll>
         </div>
      </>
   );
};

export default Page;
