import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBasket_r } from "@app/redux/actions";
import axios from "axios";
import { API_URL } from "@root/config";
import type { GetServerSideProps, NextPage } from "next";
import type { AppDispatch, RootState } from "@app/redux/store";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import dynamic from "next/dynamic";

const Head = dynamic(() => import("@app/app/core/Head"));
const ProductGallerry = dynamic(() => import("@app/app/components/ProductDetail/Gallerry"));
const PoductVariants = dynamic(() => import("@app/app/components/ProductDetail/PoductVariants"));

type ProductImage = {
   image: string;
   [key: string]: unknown;
   order: number;
};

type ProductDetail = {
   _id: string;
   seo: string;
   title: string;
   description_short?: string;
   keys?: string;
   allImages: ProductImage[];
   description: string;
   [key: string]: unknown;
};

interface ProductPageProps {
   resData: ProductDetail[];
   seo: string;
}

const Page: NextPage<ProductPageProps> = ({ resData = [], seo = "" }) => {
   const { user } = useSelector(({ login }: RootState) => login);

   const state = resData[0] || {
      title: "",
      description_short: "",
      keys: "",
      description: "",
      allImages: [],
   };
   const [contentDescription, setContentDescription] = useState("<p></p>");

   const dispatch = useDispatch<AppDispatch>();

   const getBasket = () => {
      const userId = typeof user.id === "string" ? user.id : null;
      dispatch(getBasket_r(userId));
   };

   function createMarkup() {
      return { __html: contentDescription };
   }



   const replaceStyle = (dataHtml: string) => {
      return dataHtml
        .replace(/<p>/g, "<p style='min-height:25px' >")
        .replace(
          /<pre>/g,
          "<pre  style='min-height:30px; background-color:#dbdbdb; padding:15px' >"
        )
        .replace(/<img /g, "<img class='w-full sm:w-auto' ")
        .replace(
          /<div class="media-wrap image-wrap /g,
          '<div class="media-wrap image-wrap  w-full sm:w-auto '
        );
    };



   useEffect(() => {
      getBasket();
      setContentDescription(replaceStyle(state.description));
   }, [state.description]);

   return (
      <div className="container-custom h-full ">
         <Head
            title={state.title}
            description={state.description_short}
            keywords={state.keys}
            image={state.allImages.length > 0 ? state.allImages[0].image : ""}
         />
         <div className=" shadow-2xl bg-white  p-0 lg:p-4 grid grid-cols-12 my-0 lg:my-8  ">
            <div className=" col-span-12 lg:col-span-5  rounded-lg  ">
               <ProductGallerry images={state.allImages} />
            </div>
            <div className=" col-span-12 lg:col-span-7">
               <PoductVariants data={state} />
            </div>
         </div>

         <div className="w-full mt-5 mb-10 p-10 shadow-2xl bg-white h-full min-h-10  ">

            <div dangerouslySetInnerHTML={createMarkup()} />

         </div>
      </div>
   );
};

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({
   query,
}) => {
   const response = await axios.get(`${API_URL}/productspublic/${query.seo}`);
   return {
      props: {
         resData: response.data,
         seo: typeof query.seo === "string" ? query.seo : "",
      },
   };
};

export default Page;
