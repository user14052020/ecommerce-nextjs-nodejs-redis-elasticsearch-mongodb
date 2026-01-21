import func from "@app/util/helpers/func";
import axios from "axios";
import { wrapper } from "@app/redux/store";
import {
   API_URL,
   HOME_FIRST_BOX_CATEGORY_ID,
   HOME_OFFER_LIST_ID,
   HOME_SLIDER_CATEGORY_ID,
} from "@root/config";
import type { GetServerSideProps, NextPage } from "next";

import dynamic from "next/dynamic";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const HomeFirstBox = dynamic(() => import("@app/app/components/Home/HomeFirstBox"));
const HomeSeccoundBoxs = dynamic(() => import("@app/app/components/Home/HomeSeccoundBoxs"));
const HomeOfferList = dynamic(() => import("@app/app/components/Home/HomeOfferList"));
const HomeProductsFirst = dynamic(() => import("@app/app/components/Home/HomeProductsFirst"));
const Brands = dynamic(() => import("@app/app/components/Brands"));
const HomeSlider = dynamic(() => import("@app/app/components/Home/HomeSlider"));
const Head = dynamic(() => import("@app/app/core/Head"));

type CategoryItem = {
   _id: string;
   title?: string;
   description?: string;
   [key: string]: unknown;
};

type ProductItem = {
   [key: string]: unknown;
};

interface HomeProps {
   resData: CategoryItem[];
   resProductFirst: ProductItem[];
   resProductSeccond: ProductItem[];
}

const HomePage: NextPage<HomeProps> = ({
   resData = [],
   resProductFirst = [],
   resProductSeccond = [],
}) => {


   const homeSlider = func.getCategoriesTree(
      resData,
      HOME_SLIDER_CATEGORY_ID
   );
   const homeFirstBox = func.getCategoriesTree(
      resData,
      HOME_FIRST_BOX_CATEGORY_ID
   );
   const homeOfferList = func.getCategoriesTree(
      resData,
      HOME_OFFER_LIST_ID
   );

   const offerItem = resData.find((val) => val._id === HOME_OFFER_LIST_ID);
   const homeOfferListtitle = {
      title: offerItem?.title,
      description: offerItem?.description,
   };

   return (
      <div>
         <Head />
         <Brands />
         <HomeSlider state={homeSlider} />
         <HomeProductsFirst
            state={resProductFirst}
            title={{
               title: "Best Sellers",
               description: "Our Most Popular Products",
            }}
         />
         <HomeFirstBox state={homeFirstBox} />
         <HomeSeccoundBoxs
            state={resProductSeccond}
            title={{
               title: "New Products",
               description: "We Added New Products For You",
            }}
         />
         <HomeOfferList state={homeOfferList} title={homeOfferListtitle} />
      </div>
   );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = wrapper.getServerSideProps(
   () => async () => {
      const response = await axios.get(`${API_URL}/homesliderpublic`);

   const filterObjectFirst = {
      sort: { saleqty: -1 },
      limit: 10,
      skip: 0,
   };

   const responseProductFirs = await axios.post(
      `${API_URL}/productspublic/home`,
      filterObjectFirst
   );

   const filterObjectSeccond = {
      sort: { createdAt: -1 },
      limit: 15,
      skip: 0,
   };

   const responseProductSeccond = await axios.post(
      `${API_URL}/productspublic/home`,
      filterObjectSeccond
   );

      return {
         props: {
            resData: response.data,
            resProductFirst: responseProductFirs.data,
            resProductSeccond: responseProductSeccond.data,
         },
      };
   }
);

export default HomePage;
